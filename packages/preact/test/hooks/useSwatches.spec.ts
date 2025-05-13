import { SearchProductSku } from "@nosto/nosto-js/client"
import { useSwatches } from "@preact/hooks/useSwatches/useSwatches"
import { renderHook } from "@testing-library/preact"
import { describe, expect, it } from "vitest"

function createSwatchOptions(fields: Record<string, string>): { key: string; value: string }[] {
  return Object.entries(fields).map(([key, value]) => ({ key, value }))
}

function createTestSwatchField(
  field: string,
  values: Record<string, SearchProductSku[]>,
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
      Red: [testSKUs[0], testSKUs[1]],
      Blue: [testSKUs[2], testSKUs[3]],
      Green: [testSKUs[4], testSKUs[5]]
    }),
    createTestSwatchField("size", {
      S: [testSKUs[0], testSKUs[4]],
      M: [testSKUs[1], testSKUs[2]],
      L: [testSKUs[3]],
      XL: [testSKUs[5]]
    }),
    createTestSwatchField("material", {
      Cotton: [testSKUs[0], testSKUs[2]],
      Silk: [testSKUs[1], testSKUs[4]],
      Wool: [testSKUs[3], testSKUs[5]]
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
          Red: [testSKUs[0], testSKUs[1]],
          Blue: [testSKUs[2], testSKUs[3]],
          Green: [testSKUs[4], testSKUs[5]]
        },
        "Red"
      ),
      createTestSwatchField(
        "size",
        {
          S: [testSKUs[0], testSKUs[4]],
          M: [testSKUs[1], testSKUs[2]],
          L: [testSKUs[3]],
          XL: [testSKUs[5]]
        },
        undefined,
        ["L", "XL"]
      ),
      createTestSwatchField(
        "material",
        {
          Cotton: [testSKUs[0], testSKUs[2]],
          Silk: [testSKUs[1], testSKUs[4]],
          Wool: [testSKUs[3], testSKUs[5]]
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
          Red: [testSKUs[0], testSKUs[1]],
          Blue: [testSKUs[2], testSKUs[3]],
          Green: [testSKUs[4], testSKUs[5]]
        },
        "Red",
        ["Blue", "Green"]
      ),
      createTestSwatchField(
        "size",
        {
          S: [testSKUs[0], testSKUs[4]],
          M: [testSKUs[1], testSKUs[2]],
          L: [testSKUs[3]],
          XL: [testSKUs[5]]
        },
        "M",
        ["S", "L", "XL"]
      ),
      createTestSwatchField(
        "material",
        {
          Cotton: [testSKUs[0], testSKUs[2]],
          Silk: [testSKUs[1], testSKUs[4]],
          Wool: [testSKUs[3], testSKUs[5]]
        },
        "Silk",
        ["Cotton", "Wool"]
      )
    ])
  })

  it("should return the correct selectedSku when all options match", () => {
    const { result, rerender } = renderHook(() => useSwatches(testSKUs, ["color", "size", "material"]))

    result.current.toggleOption("color", "Red")
    rerender()
    result.current.toggleOption("size", "S")
    rerender()
    result.current.toggleOption("material", "Cotton")
    rerender()

    expect(result.current.selectedSku?.id).toBe("SKU-001")
  })
})
