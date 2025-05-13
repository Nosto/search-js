import { useSpeechToText } from "@preact/hooks/useSpeechToText"
import { describe, expect, it, vi } from "vitest"

import { mockStore } from "../mocks/mocks"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

describe("useSpeechToText", () => {
  const store = mockStore({
    loading: false,
    initialized: true,
    query: {
      products: {
        sort: []
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

  it("should set isSupported to false if SpeechRecognition is not available", () => {
    Object.assign(window, {
      SpeechRecognition: undefined,
      webkitSpeechRecognition: undefined
    })

    const { result } = renderHookWithProviders(() => useSpeechToText(), { store })

    expect(result.current.isSupported).toBe(false)
  })

  it("should set isSupported to true if SpeechRecognition is available", () => {
    Object.assign(window, {
      SpeechRecognition: vi.fn()
    })

    const { result } = renderHookWithProviders(() => useSpeechToText(), { store })

    expect(result.current.isSupported).toBe(true)
  })
})
