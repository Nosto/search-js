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
let useSpeechToText: typeof import("@preact/hooks/useSpeechToText/useSpeechToText").useSpeechToText
let renderHookWithProviders: typeof import("../../mocks/renderHookWithProviders").renderHookWithProviders
let mockStore: typeof import("../../mocks/mocks").mockStore

beforeAll(async () => {
  // Lazy-load modules AFTER mocks are set up
  useSpeechToText = (await import("@preact/hooks/useSpeechToText/useSpeechToText")).useSpeechToText
  renderHookWithProviders = (await import("../../mocks/renderHookWithProviders")).renderHookWithProviders
  mockStore = (await import("../../mocks/mocks")).mockStore
})

describe("useSpeechToText", () => {
  it("calls start on SpeechRecognition", () => {
    const store = mockStore({
      loading: false,
      initialized: true,
      query: {
        products: {
          from: 0
        }
      },
      response: {
        products: {
          size: 10,
          total: 100,
          hits: []
        }
      }
    })

    const { startListening, stopListening } = renderHookWithProviders(() => useSpeechToText(), { store }).result.current

    expect(startMock).not.toHaveBeenCalled()

    startListening({
      onResult: vi.fn()
    })

    expect(startMock).toHaveBeenCalled()
    stopListening()
    expect(stopMock).toHaveBeenCalled()
  })
})
