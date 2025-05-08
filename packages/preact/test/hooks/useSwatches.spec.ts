import { useSwatches } from "@preact/hooks/useSwatches"
import { describe, expect, it } from "vitest"

import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

const testSKUs = [
  {
    id: "SKU-001",
    customFields: [
      { key: "color", value: "Red" },
      { key: "size", value: "S" }
    ]
  },
  {
    id: "SKU-002",
    customFields: [
      { key: "color", value: "Red" },
      { key: "size", value: "M" }
    ]
  },
  {
    id: "SKU-003",
    customFields: [
      { key: "color", value: "Blue" },
      { key: "size", value: "S" }
    ]
  }
]

describe("useSwatches", () => {
  it("should return empty swatches if no SKUs are provided", () => {
    const { result } = renderHookWithProviders(() => useSwatches([], ["color", "size"]))
    expect(result.current.swatches).toEqual([])
    expect(result.current.selectedOptions).toEqual({})
  })

  it("should aggregate swatches correctly based on fields", () => {
    const { result } = renderHookWithProviders(() => useSwatches(testSKUs, ["color", "size"]))
    expect(result.current.swatches).toEqual([
      {
        field: "color",
        options: [
          { value: "Red", skus: ["SKU-001", "SKU-002"], unavailable: false },
          { value: "Blue", skus: ["SKU-003"], unavailable: false }
        ]
      },
      {
        field: "size",
        options: [
          { value: "S", skus: ["SKU-001", "SKU-003"], unavailable: false },
          { value: "M", skus: ["SKU-002"], unavailable: false }
        ]
      }
    ])
    expect(result.current.selectedOptions).toEqual({})
  })

  it("should toggle options correctly", () => {
    const { result, rerender } = renderHookWithProviders(() => useSwatches(testSKUs, ["color", "size"]))

    result.current.toggleOption("color", "Red")
    rerender()
    expect(result.current.selectedOptions).toStrictEqual({ color: "Red" })

    result.current.toggleOption("color", "Red")
    rerender()
    expect(result.current.selectedOptions).toStrictEqual({})
  })

  it("should handle multiple selections correctly", () => {
    const { result, rerender } = renderHookWithProviders(() => useSwatches(testSKUs, ["color", "size"]))

    result.current.toggleOption("color", "Red")
    rerender()
    expect(result.current.selectedOptions).toStrictEqual({ color: "Red" })

    result.current.toggleOption("size", "M")
    rerender()
    expect(result.current.selectedOptions).toStrictEqual({ color: "Red", size: "M" })

    expect(result.current.swatches).toEqual([
      {
        field: "color",
        options: [
          { value: "Red", skus: ["SKU-001", "SKU-002"], unavailable: false },
          { value: "Blue", skus: ["SKU-003"], unavailable: true }
        ]
      },
      {
        field: "size",
        options: [
          { value: "S", skus: ["SKU-001", "SKU-003"], unavailable: false },
          { value: "M", skus: ["SKU-002"], unavailable: false }
        ]
      }
    ])
  })

  it("should correctly mark unavailable swatches", () => {
    const { result, rerender } = renderHookWithProviders(() => useSwatches(testSKUs, ["color", "size"]))

    result.current.toggleOption("size", "M")
    rerender()
    expect(result.current.selectedOptions).toStrictEqual({ size: "M" })
    expect(result.current.swatches).toEqual([
      {
        field: "color",
        options: [
          { value: "Red", skus: ["SKU-001", "SKU-002"], unavailable: false },
          { value: "Blue", skus: ["SKU-003"], unavailable: true }
        ]
      },
      {
        field: "size",
        options: [
          { value: "S", skus: ["SKU-001", "SKU-003"], unavailable: false },
          { value: "M", skus: ["SKU-002"], unavailable: false }
        ]
      }
    ])
  })
})
