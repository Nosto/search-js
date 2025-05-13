import { useEffect, useState } from "preact/hooks"

interface SpeechToTextOptions {
  language?: string
  interimResults?: boolean
}

export function useSpeechToText(options?: SpeechToTextOptions) {
  const { language = "en-US", interimResults = false } = options || {}

  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(true)

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

  const startListening = ({
    onResult,
    onError
  }: {
    onResult: (result: string) => void
    onError?: (error: string) => void
  }) => {
    if (!isSupported) {
      return
    }
    const recognizer = new SpeechRecognition()
    recognizer.lang = language
    recognizer.interimResults = interimResults
    recognizer.onstart = () => setIsListening(true)
    recognizer.onresult = event => onResult(event.results?.[0]?.[0]?.transcript)

    if (onError) {
      recognizer.onerror = event => onError(event.error)
    }

    recognizer.onend = () => setIsListening(false)
    recognizer.start()
  }

  const stopListening = () => {
    if (isSupported) {
      const recognizer = new SpeechRecognition()
      recognizer.stop()
      setIsListening(false)
    }
  }

  useEffect(() => {
    if (!SpeechRecognition) {
      setIsSupported(false)
    }
  }, [SpeechRecognition])

  return {
    isListening,
    startListening,
    stopListening,
    isSupported
  }
}
