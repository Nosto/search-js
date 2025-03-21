import { nostojs } from "@nosto/nosto-js"
import { clearNostoGlobals, mockNostojs } from "@nosto/nosto-js/testing"
import { usePersonalization } from "@preact/hooks/usePersonalization"
import { renderHook } from "@testing-library/preact"
import { afterEach, describe, expect, it } from "vitest"

describe("usePersonalization", () => {
  afterEach(() => {
    clearNostoGlobals()
  })

  it("should initialize with empty segments and boost", () => {
    const { result } = renderHook(() => usePersonalization())
    expect(result.current.segments).toEqual([])
    expect(result.current.boost).toEqual([])
  })

  it("should set segments and boost from API", async () => {
    const mockSegments = ["segment1", "segment2"]
    const mockBoost = [{ id: "boost1" }, { id: "boost2" }]

    mockNostojs({
      // @ts-expect-error FIXME
      getSearchSessionParams: async () => ({
        products: { personalizationBoost: mockBoost },
        segments: mockSegments
      })
    })

    const { result, rerender } = renderHook(() => usePersonalization())
    await new Promise(nostojs)
    rerender()

    expect(result.current.segments).toEqual(mockSegments)
    expect(result.current.boost).toEqual(mockBoost)
  })

  it("should handle missing segments and boost gracefully", async () => {
    mockNostojs({
      getSearchSessionParams: async () => ({})
    })

    const { result, rerender } = renderHook(() => usePersonalization())
    await new Promise(nostojs)
    rerender()

    expect(result.current.segments).toEqual([])
    expect(result.current.boost).toEqual([])
  })
})
