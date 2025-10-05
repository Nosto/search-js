import { renderHook } from "@testing-library/preact"
import { describe, expect, it, vi } from "vitest"

import { mockSpeechToText } from "../mocks/speechMock"

describe("useSpeechToText", async () => {
  const startMock = vi.fn()
  const stopMock = vi.fn()

  const { useSpeechToText } = await mockSpeechToText({
    start: startMock,
    stop: stopMock
  })

  it("calls start and stop methods of SpeechRecognition", () => {
    const { result } = renderHook(() =>
      useSpeechToText({
        onResult: vi.fn()
      })
    )

    expect(startMock).not.toHaveBeenCalled()
    expect(stopMock).not.toHaveBeenCalled()

    result.current.startListening()

    expect(startMock).toHaveBeenCalled()

    result.current.stopListening()

    expect(stopMock).toHaveBeenCalled()
  })

  it("maintains object reference stability on re-render", () => {
    const { result, rerender } = renderHook(() => useSpeechToText())
    const firstRender = result.current
    
    // Force re-render without state change
    rerender()
    const secondRender = result.current
    
    // Object reference should be stable when state hasn't changed
    expect(firstRender).toBe(secondRender)
  })
})
