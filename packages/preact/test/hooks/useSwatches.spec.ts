import { useSwatches } from "@preact/hooks/useSwatches/useSwatches"
import { renderHook } from "@testing-library/preact"
import { describe, expect, it } from "vitest"

function createSwatchOptions(fields: Record<string, string>): { key: string; value: string }[] {
  return Object.entries(fields).map(([key, value]) => ({ key, value }))
}

function createTestSwatchField(
  field: string,
  values: Record<string, string[]>,
  selectedValue?: string,
  unavailableValues: string[] = []
) {
  return {
    field,
    options: Object.entries(values).map(([value, skus]) => ({
      value,
      skus,
      unavailable: unavailableValues.includes(value),
      selected: value === selectedValue
    }))
  }
}

function createExpectedSwatches() {
  return [
    createTestSwatchField("color", {
      Red: ["SKU-001", "SKU-002"],
      Blue: ["SKU-003", "SKU-004"],
      Green: ["SKU-005", "SKU-006"]
    }),
    createTestSwatchField("size", {
      S: ["SKU-001", "SKU-005"],
      M: ["SKU-002", "SKU-003"],
      L: ["SKU-004"],
      XL: ["SKU-006"]
    }),
    createTestSwatchField("material", {
      Cotton: ["SKU-001", "SKU-003"],
      Silk: ["SKU-002", "SKU-005"],
      Wool: ["SKU-004", "SKU-006"]
    })
  ]
}

const testSKUs = [
  {
    id: "SKU-001",
    customFields: createSwatchOptions({
      color: "Red",
      size: "S",
      material: "Cotton"
    })
  },
  {
    id: "SKU-002",
    customFields: createSwatchOptions({
      color: "Red",
      size: "M",
      material: "Silk"
    })
  },
  {
    id: "SKU-003",
    customFields: createSwatchOptions({
      color: "Blue",
      size: "M",
      material: "Cotton"
    })
  },
  {
    id: "SKU-004",
    customFields: createSwatchOptions({
      color: "Blue",
      size: "L",
      material: "Wool"
    })
  },
  {
    id: "SKU-005",
    customFields: createSwatchOptions({
      color: "Green",
      size: "S",
      material: "Silk"
    })
  },
  {
    id: "SKU-006",
    customFields: createSwatchOptions({
      color: "Green",
      size: "XL",
      material: "Wool"
    })
  }
]

describe("useSwatches", () => {
  it("should return empty swatches if no SKUs are provided", () => {
    const { result } = renderHook(() => useSwatches([], ["color", "size"]))
    expect(result.current.swatches).toEqual([])
  })

  it("should aggregate swatches correctly based on fields", () => {
    const { result } = renderHook(() => useSwatches(testSKUs, ["color", "size", "material"]))
    expect(result.current.swatches).toEqual(createExpectedSwatches())
  })

  it("should toggle options correctly", () => {
    const { result, rerender } = renderHook(() => useSwatches(testSKUs, ["color", "size", "material"]))

    result.current.toggleOption("color", "Red")
    rerender()
    expect(result.current.swatches).toEqual([
      createTestSwatchField(
        "color",
        {
          Red: ["SKU-001", "SKU-002"],
          Blue: ["SKU-003", "SKU-004"],
          Green: ["SKU-005", "SKU-006"]
        },
        "Red"
      ),
      createTestSwatchField(
        "size",
        {
          S: ["SKU-001", "SKU-005"],
          M: ["SKU-002", "SKU-003"],
          L: ["SKU-004"],
          XL: ["SKU-006"]
        },
        undefined,
        ["L", "XL"]
      ),
      createTestSwatchField(
        "material",
        {
          Cotton: ["SKU-001", "SKU-003"],
          Silk: ["SKU-002", "SKU-005"],
          Wool: ["SKU-004", "SKU-006"]
        },
        undefined,
        ["Wool"]
      )
    ])

    result.current.toggleOption("color", "Red")
    rerender()
    expect(result.current.swatches).toEqual(createExpectedSwatches().slice())
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
      createTestSwatchField(
        "color",
        {
          Red: ["SKU-001", "SKU-002"],
          Blue: ["SKU-003", "SKU-004"],
          Green: ["SKU-005", "SKU-006"]
        },
        "Red",
        ["Blue", "Green"]
      ),
      createTestSwatchField(
        "size",
        {
          S: ["SKU-001", "SKU-005"],
          M: ["SKU-002", "SKU-003"],
          L: ["SKU-004"],
          XL: ["SKU-006"]
        },
        "M",
        ["S", "L", "XL"]
      ),
      createTestSwatchField(
        "material",
        {
          Cotton: ["SKU-001", "SKU-003"],
          Silk: ["SKU-002", "SKU-005"],
          Wool: ["SKU-004", "SKU-006"]
        },
        "Silk",
        ["Cotton", "Wool"]
      )
    ])
  })
})
