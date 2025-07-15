import { useFacet } from "@preact/hooks/useFacet"
import { renderHook } from "@testing-library/preact"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { mockActions } from "../mocks/mocks"

describe("useFacet", () => {
  const mockFacet = {
    id: "color",
    type: "terms" as const,
    name: "Color",
    field: "color",
    data: [
      { value: "Red", selected: true, count: 10 },
      { value: "Blue", selected: false, count: 5 },
      { value: "Green", selected: true, count: 7 }
    ]
  }
  const actions = mockActions()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should initialize with active set to true if there are selected filters", () => {
    const { result } = renderHook(() => useFacet(mockFacet))
    expect(result.current.active).toBe(true)
  })

  it("should initialize with active set to false if there are no selected filters", () => {
    const facetWithoutSelectedFilters = {
      ...mockFacet,
      data: [
        { value: "Red", selected: false, count: 10 },
        { value: "Blue", selected: false, count: 5 },
        { value: "Green", selected: false, count: 7 }
      ]
    }
    const { result } = renderHook(() => useFacet(facetWithoutSelectedFilters))
    expect(result.current.active).toBe(false)
  })

  it("should force active value if provided in options", () => {
    const facetWithoutSelectedFilters = {
      ...mockFacet,
      data: [
        { value: "Red", selected: false, count: 10 },
        { value: "Blue", selected: false, count: 5 },
        { value: "Green", selected: false, count: 7 }
      ]
    }
    const { result } = renderHook(() => useFacet(facetWithoutSelectedFilters, { active: true }))
    expect(result.current.active).toBe(true)
  })

  it("should return the correct selected filters count", () => {
    const { result } = renderHook(() => useFacet(mockFacet))
    expect(result.current.selectedFiltersCount).toBe(2)
  })

  it("should return 0 selected filters count if data not provided", () => {
    const facetWithoutFilters = {
      ...mockFacet,
      data: undefined
    }
    // @ts-expect-error Checking incorrect usage
    const { result } = renderHook(() => useFacet(facetWithoutFilters))
    expect(result.current.selectedFiltersCount).toBe(0)
  })

  it("should toggle active state when toggleActive is called", () => {
    const { result, rerender } = renderHook(() => useFacet(mockFacet))
    expect(result.current.active).toBe(true)
    result.current.toggleActive()
    rerender()
    expect(result.current.active).toBe(false)
    result.current.toggleActive()
    rerender()
    expect(result.current.active).toBe(true)
  })

  it("should call toggleProductFilter with the correct arguments when toggleProductFilter is called", () => {
    const { result } = renderHook(() => useFacet(mockFacet))
    result.current.toggleProductFilter("color", "Red", false)
    expect(actions.toggleProductFilter).toHaveBeenCalledWith("color", "Red", false)
  })
})
