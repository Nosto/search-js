import { useCallback, useRef, useState } from "preact/hooks"

interface SpeechToTextOptions {
  language?: string
  interimResults?: boolean
}

interface StartListeningOptions {
  onResult: (value: string) => void
  onError?: (error: string) => void
}

export type SpeechToText = {
  listening: boolean
  startListening: (options: StartListeningOptions) => void
  stopListening: () => void
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
export const speechToTextSupported = !!(SpeechRecognition && typeof SpeechRecognition === "function")

function useSpeechToTextUnsupported(): SpeechToText {
  return {
    listening: false,
    startListening: () => {},
    stopListening: () => {}
  }
}

function useSpeechToTextSupported({
  language = "en-US",
  interimResults = false
}: SpeechToTextOptions = {}): SpeechToText {
  const [listening, setListening] = useState(false)

  const recognizerRef = useRef<SpeechRecognition | null>(null)

  const startListening = useCallback(
    ({ onResult, onError }: StartListeningOptions) => {
      const recognizer = new SpeechRecognition()
      recognizer.lang = language
      recognizer.interimResults = interimResults

      recognizer.onstart = () => setListening(true)

      recognizer.onresult = event => {
        const { transcript, confidence } = event.results?.[0]?.[0]
        onResult({ value: transcript, confidence })
      }

      if (onError) {
        recognizer.onerror = event => onError(event.error)
      }

      recognizer.onend = () => setListening(false)

      recognizerRef.current = recognizer
      recognizer.start()
    },
    [language, interimResults]
  )

  const stopListening = useCallback(() => {
    recognizerRef.current?.stop()
  }, [recognizerRef])

  return {
    listening,
    startListening,
    stopListening
  }
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
export const useSpeechToText = speechToTextSupported ? useSpeechToTextSupported : useSpeechToTextUnsupported
