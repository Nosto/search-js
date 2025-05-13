import { useCallback, useRef, useState } from "preact/hooks"

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
 *  const { startListening, stopListening, listening, supported } = useSpeechToText()
 *  if (!supported) {
 *    return null
 *  }
 *
 *  return (
 *    <button
 *     onClick={() => {
 *       if (listening) {
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
export function useSpeechToText({ language = "en-US", interimResults = false }: SpeechToTextOptions = {}) {
  const [listening, setListening] = useState(false)

  const recognizerRef = useRef<SpeechRecognition | null>(null)
  const SpeechRecognition =
    typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null

  const supported = SpeechRecognition && typeof SpeechRecognition === "function"

  const startListening = useCallback(
    ({ onResult, onError }: StartListeningOptions) => {
      if (!supported) {
        return
      }

      const recognizer = new SpeechRecognition()
      recognizer.lang = language
      recognizer.interimResults = interimResults

      recognizer.onstart = () => setListening(true)

      recognizer.onresult = event => {
        const { transcript, confidence } = event.results?.[0]?.[0]
        onResult({ value: transcript, confidence })
      }

      recognizer.onerror = event => {
        if (onError) onError(event.error)
      }

      recognizer.onend = () => setListening(false)

      recognizerRef.current = recognizer
      recognizer.start()
    },
    [language, interimResults, SpeechRecognition, supported]
  )

  const stopListening = useCallback(() => {
    recognizerRef.current?.stop()
    setListening(false)
  }, [recognizerRef])

  return {
    listening,
    supported,
    startListening,
    stopListening
  }
}
