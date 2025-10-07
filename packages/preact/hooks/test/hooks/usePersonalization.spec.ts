import { nostojs } from "@nosto/nosto-js"
import { clearNostoGlobals, mockNostojs } from "@nosto/nosto-js/testing"
import { usePersonalization } from "@preact/hooks/usePersonalization"
import { renderHook } from "@testing-library/preact"
import { afterEach, describe, expect, it } from "vitest"

import { expectStable } from "../mocks/expectStable"

describe("usePersonalization", () => {
  const mockSegments = ["segment1", "segment2"]
  const mockBoost = [
    { id: "boost1", field: "category", value: ["Shoes"], weight: 0.1 },
    { id: "boost2", field: "brand", value: ["Nike"], weight: 0.2 }
  ]

  afterEach(() => {
    clearNostoGlobals()
  })

  it("should initialize with empty segments and boost", () => {
    const { result } = renderHook(() => usePersonalization())
    expect(result.current.segments).toEqual([])
    expect(result.current.boost).toEqual([])
  })

  it("should set segments and boost from API", async () => {
    mockNostojs({
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

  it("maintains consistent object values on re-render", () => {
    mockNostojs({
      getSearchSessionParams: async () => ({
        products: { personalizationBoost: mockBoost },
        segments: mockSegments
      })
    })

    const { result, rerender } = renderHook(() => usePersonalization())
    const firstRender = result.current

    rerender()
    const secondRender = result.current
    expectStable(firstRender, secondRender)
  })
})
