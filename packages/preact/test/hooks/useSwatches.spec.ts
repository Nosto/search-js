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

function createSKU(color: string, size: string, material: string) {
  return {
    id: `${color}-${size}-${material}`,
    imageUrl: `/images/${color}-${size}-${material}.jpg`,
    customFields: createSwatchOptions({
      color,
      size,
      material
    })
  }
}

const testSKUs = [
  createSKU("Red", "S", "Cotton"),
  createSKU("Red", "M", "Silk"),
  createSKU("Blue", "M", "Cotton"),
  createSKU("Blue", "L", "Wool"),
  createSKU("Green", "S", "Silk"),
  createSKU("Green", "XL", "Wool")
]

const allSizeVariantsSKUs = [
  { id: "SKU-001", imageUrl: "/images/sku-001.jpg", customFields: createSwatchOptions({ size: "164" }) },
  { id: "SKU-002", imageUrl: "/images/sku-002.jpg", customFields: createSwatchOptions({ size: "S" }) },
  { id: "SKU-003", imageUrl: "/images/sku-003.jpg", customFields: createSwatchOptions({ size: "M" }) },
  { id: "SKU-004", imageUrl: "/images/sku-004.jpg", customFields: createSwatchOptions({ size: "34" }) },
  { id: "SKU-005", imageUrl: "/images/sku-005.jpg", customFields: createSwatchOptions({ size: "XS" }) },
  { id: "SKU-006", imageUrl: "/images/sku-006.jpg", customFields: createSwatchOptions({ size: "L" }) },
  { id: "SKU-007", imageUrl: "/images/sku-007.jpg", customFields: createSwatchOptions({ size: "38" }) },
  { id: "SKU-008", imageUrl: "/images/sku-008.jpg", customFields: createSwatchOptions({ size: "One Size" }) },
  { id: "SKU-009", imageUrl: "/images/sku-009.jpg", customFields: createSwatchOptions({ size: "Free Size" }) },
  { id: "SKU-010", imageUrl: "/images/sku-010.jpg", customFields: createSwatchOptions({ size: "152" }) }
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

  it("should ignore custom fields that are not present in SKUs", () => {
    const { result } = renderHook(() => useSwatches(testSKUs, ["color", "size", "material", "nonexistent"]))
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

  it("should return one matchedSku when full selection matches exactly one SKU", () => {
    const { result, rerender } = renderHook(() => useSwatches(testSKUs, ["color", "size", "material"]))

    result.current.toggleOption("color", "Green")
    rerender()
    result.current.toggleOption("size", "S")
    rerender()
    result.current.toggleOption("material", "Silk")
    rerender()

    expect(result.current.matchedSkus.map(s => s.id)).toEqual(["Green-S-Silk"])
  })

  it("should return matching SKUs for partial selection", () => {
    const { result, rerender } = renderHook(() => useSwatches(testSKUs, ["color", "size", "material"]))

    result.current.toggleOption("color", "Red")
    rerender()

    expect(result.current.matchedSkus.map(s => s.id)).toEqual(["Red-S-Cotton", "Red-M-Silk"])
  })

  it("should return one matchedSku even if not all fields are selected, if only one SKU matches", () => {
    const { result, rerender } = renderHook(() => useSwatches(testSKUs, ["color", "size", "material"]))

    result.current.toggleOption("color", "Green")
    rerender()
    result.current.toggleOption("size", "S")
    rerender()
    // material not selected yet, but only SKU-005 fits so far

    expect(result.current.matchedSkus.map(s => s.id)).toEqual(["Green-S-Silk"])
    expect(result.current.matchedSkus[0].imageUrl).toBe("/images/Green-S-Silk.jpg")
  })

  it("should sort all size variants: numbers first, then size codes, then unknowns", () => {
    const { result } = renderHook(() => useSwatches(allSizeVariantsSKUs, ["size"]))

    const sortedValues = result.current.swatches.find(s => s.field === "size")?.options.map(o => o.value)

    expect(sortedValues).toEqual([
      "34",
      "38",
      "152",
      "164", // numeric first
      "XS",
      "S",
      "M",
      "L", // standard size codes
      "One Size",
      "Free Size" // unknowns (at end)
    ])
  })
})
