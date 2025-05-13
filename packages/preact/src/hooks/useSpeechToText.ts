import { useCallback, useEffect, useRef, useState } from "preact/hooks"

interface SpeechToTextOptions {
  language?: string
  interimResults?: boolean
}

interface StartListeningOptions {
  onResult: ({ value, confidence }: { value: string; confidence: number }) => void
  onError?: (error: string) => void
}

/**
 * Preact hook that provides speech-to-text functionality using the Web Speech API.
 * @example
 * ```jsx
 * import { useNostoAppState, useSpeechToText } from "@nosto/search-js/preact/hooks"
 *
 * export default function MyComponent() {
 *  const { newSearch } = useActions()
 *  const { startListening, stopListening, isListening, isSupported } = useSpeechToText()
 *  if (!isSupported) {
 *    return null
 *  }
 *
 *  return (
 *    <button
 *     onClick={() => {
 *       if (isListening) {
 *         stopListening()
 *       } else {
 *         startListening({
 *           onResult: ({ value }) => {
 *             newSearch({
 *               query: value
 *             })
 *           }
 *         })
 *       }
 *     }}
 *    >
 *     🎤︎︎
 *    </button>
 *  )
 * }
 * ```
 */
export function useSpeechToText(options?: SpeechToTextOptions) {
  const { language = "en-US", interimResults = false } = options || {}

  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(true)

  const recognizerRef = useRef<SpeechRecognition | null>(null)
  const recognitionConstructor =
    typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null

  const startListening = useCallback(
    ({ onResult, onError }: StartListeningOptions) => {
      if (!recognitionConstructor) {
        setIsSupported(false)
        return
      }

      const recognizer = new recognitionConstructor()
      recognizer.lang = language
      recognizer.interimResults = interimResults

      recognizer.onstart = () => setIsListening(true)

      recognizer.onresult = event => {
        const { transcript, confidence } = event.results?.[0]?.[0]
        onResult({ value: transcript, confidence })
      }

      recognizer.onerror = event => {
        if (onError) onError(event.error)
      }

      recognizer.onend = () => setIsListening(false)

      recognizerRef.current = recognizer
      recognizer.start()
    },
    [language, interimResults, recognitionConstructor]
  )

  const stopListening = useCallback(() => {
    recognizerRef.current?.stop()
    setIsListening(false)
  }, [recognizerRef])

  useEffect(() => {
    if (!recognitionConstructor) {
      setIsSupported(false)
    }

    return () => {
      recognizerRef.current?.stop()
      recognizerRef.current = null
    }
  }, [recognitionConstructor])

  return {
    isListening,
    isSupported,
    startListening,
    stopListening
  }
}
