export const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
export const speechToTextSupported = !!(SpeechRecognition && typeof SpeechRecognition === "function")
