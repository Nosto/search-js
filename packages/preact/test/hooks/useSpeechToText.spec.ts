import { beforeAll, describe, expect, it, vi } from "vitest"

const startMock = vi.fn()
const stopMock = vi.fn()
const onResultMock = vi.fn()

beforeAll(async () => {
  class MockSpeechRecognition {
    onstart: () => void = () => {}
    onerror: (event: unknown) => void = () => {}
    onend: () => void = () => {}
    lang = ""
    interimResults = false

    onresult(event: SpeechRecognitionEvent) {
      onResultMock(event)
      this.onresult(event)
    }

    start() {
      startMock()
      this.onstart()
    }

    stop() {
      stopMock()
      this.onend()
    }
  }

  // Set global BEFORE anything imports useSpeechToText
  vi.stubGlobal("SpeechRecognition", MockSpeechRecognition)

  // Use vi.doMock to mock utils AFTER definition of mock class
  vi.doMock("@preact/hooks/useSpeechToText/utils", async () => {
    const actual = await vi.importActual("@preact/hooks/useSpeechToText/utils")
    return {
      ...actual,
      speechToTextSupported: true,
      SpeechRecognition: MockSpeechRecognition
    }
  })
})
// Import the module after mocking
// This is to ensure the mock is used in the module
// and not the original implementation
let useSpeechToText: typeof import("@preact/hooks/useSpeechToText").useSpeechToText
let renderHook: typeof import("@testing-library/preact").renderHook

beforeAll(async () => {
  // Lazy-load modules AFTER mocks are set up
  useSpeechToText = (await import("@preact/hooks/useSpeechToText")).useSpeechToText
  renderHook = (await import("@testing-library/preact")).renderHook
})

describe("useSpeechToText", () => {
  it("calls start on SpeechRecognition", () => {
    const { startListening, stopListening } = renderHook(() => useSpeechToText()).result.current

    expect(startMock).not.toHaveBeenCalled()

    startListening({
      onResult: vi.fn()
    })

    expect(startMock).toHaveBeenCalled()
    stopListening()
    expect(stopMock).toHaveBeenCalled()
  })
})
