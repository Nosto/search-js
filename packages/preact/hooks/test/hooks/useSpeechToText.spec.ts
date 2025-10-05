import { renderHook } from "@testing-library/preact"
import { describe, it, vi } from "vitest"

import { expectStable } from "../mocks/expectStable"
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

  it("maintains consistent object values on re-render", () => {
    const { result, rerender } = renderHook(() => useSpeechToText())
    const firstRender = result.current
    
    // Force re-render without state change
    rerender()
    const secondRender = result.current
    
    // Object values should be consistent when state hasn't changed
    expectStable(firstRender, secondRender)
  })
})
