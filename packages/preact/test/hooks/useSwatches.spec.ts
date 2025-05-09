import { useSwatches } from "@preact/hooks/useSwatches/useSwatches"
import { renderHook } from "@testing-library/preact"
import { describe, expect, it } from "vitest"

function createSwatchOptions<T>(
  options: Record<string, T[]>,
  selectedValue?: string,
  unavailableValues: string[] = []
) {
  return Object.entries(options).map(([value, skus]) => ({
    value,
    skus,
    selected: selectedValue === value,
    unavailable: unavailableValues.includes(value)
  }))
}
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
  })

  it("should aggregate swatches correctly based on fields", () => {
    const { result } = renderHook(() => useSwatches(testSKUs, ["color", "size", "material"]))
    expect(result.current.swatches).toEqual([
      {
        field: "color",
        options: createSwatchOptions({
          Red: ["SKU-001", "SKU-002"],
          Blue: ["SKU-003", "SKU-004"],
          Green: ["SKU-005", "SKU-006"]
        })
      },
      {
        field: "size",
        options: createSwatchOptions({
          S: ["SKU-001", "SKU-005"],
          M: ["SKU-002", "SKU-003"],
          L: ["SKU-004"],
          XL: ["SKU-006"]
        })
      },
      {
        field: "material",
        options: createSwatchOptions({
          Cotton: ["SKU-001", "SKU-003"],
          Silk: ["SKU-002", "SKU-005"],
          Wool: ["SKU-004", "SKU-006"]
        })
      }
    ])
  })

  it("should toggle options correctly", () => {
    const { result, rerender } = renderHook(() => useSwatches(testSKUs, ["color", "size"]))

    result.current.toggleOption("color", "Red")
    rerender()
    expect(result.current.swatches).toEqual([
      {
        field: "color",
        options: createSwatchOptions(
          {
            Red: ["SKU-001", "SKU-002"],
            Blue: ["SKU-003", "SKU-004"],
            Green: ["SKU-005", "SKU-006"]
          },
          "Red"
        )
      },
      {
        field: "size",
        options: createSwatchOptions(
          {
            S: ["SKU-001", "SKU-005"],
            M: ["SKU-002", "SKU-003"],
            L: ["SKU-004"],
            XL: ["SKU-006"]
          },
          undefined,
          ["L", "XL"]
        )
      }
    ])

    result.current.toggleOption("color", "Red")
    rerender()
    expect(result.current.swatches).toEqual([
      {
        field: "color",
        options: createSwatchOptions({
          Red: ["SKU-001", "SKU-002"],
          Blue: ["SKU-003", "SKU-004"],
          Green: ["SKU-005", "SKU-006"]
        })
      },
      {
        field: "size",
        options: createSwatchOptions({
          S: ["SKU-001", "SKU-005"],
          M: ["SKU-002", "SKU-003"],
          L: ["SKU-004"],
          XL: ["SKU-006"]
        })
      }
    ])
  })

  it("should handle multiple selections correctly", () => {
    const { result, rerender } = renderHook(() => useSwatches(testSKUs, ["color", "size", "material"]))

    result.current.toggleOption("color", "Red")
    rerender()
    result.current.toggleOption("size", "M")
    rerender()
    result.current.toggleOption("material", "Silk")
    rerender()

    expect(result.current.swatches).toEqual([
      {
        field: "color",
        options: createSwatchOptions(
          {
            Red: ["SKU-001", "SKU-002"],
            Blue: ["SKU-003", "SKU-004"],
            Green: ["SKU-005", "SKU-006"]
          },
          "Red",
          ["Blue", "Green"]
        )
      },
      {
        field: "size",
        options: createSwatchOptions(
          {
            S: ["SKU-001", "SKU-005"],
            M: ["SKU-002", "SKU-003"],
            L: ["SKU-004"],
            XL: ["SKU-006"]
          },
          "M",
          ["S", "L", "XL"]
        )
      },
      {
        field: "material",
        options: createSwatchOptions(
          {
            Cotton: ["SKU-001", "SKU-003"],
            Silk: ["SKU-002", "SKU-005"],
            Wool: ["SKU-004", "SKU-006"]
          },
          "Silk",
          ["Cotton", "Wool"]
        )
      }
    ])
  })
})
