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
    const { result } = renderHook(() => useSpeechToText())

    expect(startMock).not.toHaveBeenCalled()
    expect(stopMock).not.toHaveBeenCalled()

    result.current.startListening({ onResult: vi.fn() })

    expect(startMock).toHaveBeenCalled()

    result.current.stopListening()

    expect(stopMock).toHaveBeenCalled()
  })
})
