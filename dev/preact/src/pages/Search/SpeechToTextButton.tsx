import { speechToTextSupported, useActions, useSpeechToText } from "@nosto/search-js/preact/hooks"

export function SpeechToTextButton() {
  const { newSearch } = useActions()

  const { startListening, listening, stopListening } = useSpeechToText({
    interimResults: true,
    onResult: value => {
      newSearch({
        query: value
      })
    }
  })

  if (!speechToTextSupported) {
    return null
  }

  return (
    <button
      style={{
        padding: "12px 24px",
        fontSize: "16px",
        backgroundColor: "#673ab8",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "500"
      }}
      onClick={() => {
        if (listening) {
          stopListening()
        } else {
          startListening()
        }
      }}
    >
      🎤︎︎
    </button>
  )
}
