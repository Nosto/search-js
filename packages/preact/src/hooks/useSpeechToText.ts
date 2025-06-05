import { useCallback, useRef, useState } from "preact/hooks"

interface SpeechToTextOptions {
  language?: string
  interimResults?: boolean
  onResult?: (value: string) => void
  onError?: (error: string) => void
}

export type SpeechToText = {
  listening: boolean
  startListening: () => void
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
  interimResults = false,
  onResult,
  onError
}: SpeechToTextOptions = {}): SpeechToText {
  const [listening, setListening] = useState(false)

  const recognizerRef = useRef<SpeechRecognition | null>(null)

  const startListening = useCallback(() => {
    const recognizer = new SpeechRecognition()
    recognizer.lang = language
    recognizer.interimResults = interimResults

    recognizer.onstart = () => setListening(true)

    if (onResult) {
      recognizer.onresult = event => {
        const { transcript } = event.results?.[0]?.[0]
        onResult(transcript)
      }
    }

    if (onError) {
      recognizer.onerror = event => onError(event.error)
    }

    recognizer.onend = () => setListening(false)

    recognizerRef.current = recognizer
    recognizer.start()
  }, [language, interimResults, onError, onResult])

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
 * import { useNostoAppState, useSpeechToText, speechToTextSupported } from "@nosto/search-js/preact/hooks"
 *
 * export default function MyComponent() {
 *  const { newSearch } = useActions()
 *  const { startListening, stopListening, listening } = useSpeechToText({
 *    onResult: query => newSearch({ query }),
 *    onError: error => console.error("Speech recognition error:", error)
 *  })
 *  if (!speechToTextSupported) {
 *    return null
 *  }
 *
 *  return (
 *    <button
 *     onClick={() => {
 *       if (listening) {
 *         stopListening()
 *       } else {
 *         startListening()
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
