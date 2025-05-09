import { useSwatches } from "@preact/hooks/useSwatches"
import { renderHook } from "@testing-library/preact"
import { describe, expect, it } from "vitest"

const testSKUs = [
  {
    id: "SKU-001",
    customFields: [
      { key: "color", value: "Red" },
      { key: "size", value: "S" },
      { key: "material", value: "Cotton" }
    ]
  },
  {
    id: "SKU-002",
    customFields: [
      { key: "color", value: "Red" },
      { key: "size", value: "M" },
      { key: "material", value: "Silk" }
    ]
  },
  {
    id: "SKU-003",
    customFields: [
      { key: "color", value: "Blue" },
      { key: "size", value: "M" },
      { key: "material", value: "Cotton" }
    ]
  },
  {
    id: "SKU-004",
    customFields: [
      { key: "color", value: "Blue" },
      { key: "size", value: "L" },
      { key: "material", value: "Wool" }
    ]
  },
  {
    id: "SKU-005",
    customFields: [
      { key: "color", value: "Green" },
      { key: "size", value: "S" },
      { key: "material", value: "Silk" }
    ]
  },
  {
    id: "SKU-006",
    customFields: [
      { key: "color", value: "Green" },
      { key: "size", value: "XL" },
      { key: "material", value: "Wool" }
    ]
  }
]

describe("useSwatches", () => {
  it("should return empty swatches if no SKUs are provided", () => {
    const { result } = renderHook(() => useSwatches([], ["color", "size"]))
    expect(result.current.swatches).toEqual([])
    expect(result.current.selectedOptions).toEqual({})
  })

  it("should aggregate swatches correctly based on fields", () => {
    const { result } = renderHook(() => useSwatches(testSKUs, ["color", "size", "material"]))
    expect(result.current.swatches).toEqual([
      {
        field: "color",
        options: [
          { value: "Red", skus: ["SKU-001", "SKU-002"], unavailable: false, selected: false },
          { value: "Blue", skus: ["SKU-003", "SKU-004"], unavailable: false, selected: false },
          { value: "Green", skus: ["SKU-005", "SKU-006"], unavailable: false, selected: false }
        ]
      },
      {
        field: "size",
        options: [
          { value: "S", skus: ["SKU-001", "SKU-005"], unavailable: false, selected: false },
          { value: "M", skus: ["SKU-002", "SKU-003"], unavailable: false, selected: false },
          { value: "L", skus: ["SKU-004"], unavailable: false, selected: false },
          { value: "XL", skus: ["SKU-006"], unavailable: false, selected: false }
        ]
      },
      {
        field: "material",
        options: [
          { value: "Cotton", skus: ["SKU-001", "SKU-003"], unavailable: false, selected: false },
          { value: "Silk", skus: ["SKU-002", "SKU-005"], unavailable: false, selected: false },
          { value: "Wool", skus: ["SKU-004", "SKU-006"], unavailable: false, selected: false }
        ]
      }
    ])
    expect(result.current.selectedOptions).toEqual({})
  })

  it("should toggle options correctly", () => {
    const { result, rerender } = renderHook(() => useSwatches(testSKUs, ["color", "size"]))

    result.current.toggleOption("color", "Red")
    rerender()
    expect(result.current.selectedOptions).toStrictEqual({ color: "Red" })

    result.current.toggleOption("color", "Red")
    rerender()
    expect(result.current.selectedOptions).toStrictEqual({})
  })

  it("should handle multiple selections correctly", () => {
    const { result, rerender } = renderHook(() => useSwatches(testSKUs, ["color", "size", "material"]))

    result.current.toggleOption("color", "Red")
    rerender()
    expect(result.current.selectedOptions).toStrictEqual({ color: "Red" })

    result.current.toggleOption("size", "M")
    rerender()
    expect(result.current.selectedOptions).toStrictEqual({ color: "Red", size: "M" })

    result.current.toggleOption("material", "Silk")
    rerender()
    expect(result.current.selectedOptions).toStrictEqual({
      color: "Red",
      size: "M",
      material: "Silk"
    })

    expect(result.current.swatches).toEqual([
      {
        field: "color",
        options: [
          { value: "Red", skus: ["SKU-001", "SKU-002"], unavailable: false, selected: true },
          { value: "Blue", skus: ["SKU-003", "SKU-004"], unavailable: true, selected: false },
          { value: "Green", skus: ["SKU-005", "SKU-006"], unavailable: true, selected: false }
        ]
      },
      {
        field: "size",
        options: [
          { value: "S", skus: ["SKU-001", "SKU-005"], unavailable: true, selected: false },
          { value: "M", skus: ["SKU-002", "SKU-003"], unavailable: false, selected: true },
          { value: "L", skus: ["SKU-004"], unavailable: true, selected: false },
          { value: "XL", skus: ["SKU-006"], unavailable: true, selected: false }
        ]
      },
      {
        field: "material",
        options: [
          { value: "Cotton", skus: ["SKU-001", "SKU-003"], unavailable: true, selected: false },
          { value: "Silk", skus: ["SKU-002", "SKU-005"], unavailable: false, selected: true },
          { value: "Wool", skus: ["SKU-004", "SKU-006"], unavailable: true, selected: false }
        ]
      }
    ])
  })
})
