import type { InputSearchFilter } from "@nosto/nosto-js/client"
import { useRange } from "@preact/hooks/useRange"
import { beforeEach, describe, expect, it } from "vitest"

import { expectStable } from "../mocks/expectStable"
import { mockActions, mockStore, resetStore } from "../mocks/mocks"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

describe("useRange", () => {
  const actions = mockActions()
  const store = mockStore({
    loading: false,
    initialized: true,
    query: {
      products: {
        from: 0
      }
    },
    response: {
      products: {
        size: 10,
        total: 100,
        hits: [],
        facets: [
          {
            name: "price",
            id: "price",
            field: "price",
            min: 0,
            max: 100,
            type: "stats"
          }
        ]
      }
    }
  })

  beforeEach(() => {
    resetStore(store)
  })

  it("maintains consistent object values on re-render", () => {
    const render = renderHookWithProviders(() => useRange("price"), { store })
    const firstRender = render.result.current

    render.rerender()
    const secondRender = render.result.current
    expectStable(firstRender, secondRender)
  })

  it("handles various updateRange scenarios", () => {
    const render = renderHookWithProviders(() => useRange("price"), { store })
    const { updateRange } = render.result.current

    updateRange([30, undefined])
    expect(actions.replaceFilter).toHaveBeenLastCalledWith("price", {
      gte: "30"
    })

    updateRange([undefined, 40])
    expect(actions.replaceFilter).toHaveBeenLastCalledWith("price", {
      lte: "40"
    })

    updateRange([30, 40])
    expect(actions.replaceFilter).toHaveBeenLastCalledWith("price", {
      gte: "30",
      lte: "40"
    })

    updateRange([undefined, undefined])
    expect(actions.replaceFilter).toHaveBeenLastCalledWith("price", undefined)

    updateRange([-10, -5])
    expect(actions.replaceFilter).toHaveBeenLastCalledWith("price", {
      gte: "-10",
      lte: "-5"
    })

    updateRange([0, 0])
    expect(actions.replaceFilter).toHaveBeenLastCalledWith("price", {
      lte: "0"
    })
  })

  it("handles missing facet", () => {
    store.updateState({
      query: {
        products: {
          filter: []
        }
      }
    })
    const render = renderHookWithProviders(() => useRange("missing"), { store })
    const { min, max, range, active, updateRange } = render.result.current
    expect(min).toBe(0)
    expect(max).toBe(0)
    expect(range).toEqual([0, 0])
    expect(active).toBe(false)
    expect(updateRange).toBeInstanceOf(Function)
  })

  it("updates range using updateRange", () => {
    const render = renderHookWithProviders(() => useRange("price"), { store })
    const { range, updateRange } = render.result.current
    expect(range).toEqual([0, 100])
    updateRange([30, 40])
    expect(actions.replaceFilter).toHaveBeenLastCalledWith("price", {
      gte: "30",
      lte: "40"
    })
  })

  it("returns false when no filter is active", () => {
    const render = renderHookWithProviders(() => useRange("price"), { store })
    const { active } = render.result.current
    expect(active).toBe(false)
  })

  it("returns true when both gte and lte filters are active", () => {
    store.updateState({
      query: {
        products: {
          filter: [{ field: "price", range: [{ gte: "10", lte: "50" }] }]
        }
      }
    })
    const render = renderHookWithProviders(() => useRange("price"), { store })
    const { active } = render.result.current
    expect(active).toBe(true)
  })

  it("returns true when only gte filter is active", () => {
    store.updateState({
      query: {
        products: {
          filter: [{ field: "price", range: [{ gte: "10" }] }]
        }
      }
    })
    const render = renderHookWithProviders(() => useRange("price"), { store })
    const { active } = render.result.current
    expect(active).toBe(true)
  })

  it("returns true when only lte filter is active", () => {
    store.updateState({
      query: {
        products: {
          filter: [{ field: "price", range: [{ lte: "50" }] }]
        }
      }
    })
    const render = renderHookWithProviders(() => useRange("price"), { store })
    const { active } = render.result.current
    expect(active).toBe(true)
  })

  describe("state tests", () => {
    function testRangeState(
      label: string,
      filter: Partial<InputSearchFilter>[] = [],
      expected: Partial<ReturnType<typeof useRange>>
    ) {
      it(label, () => {
        store.updateState({
          query: {
            products: {
              filter
            }
          }
        })
        const render = renderHookWithProviders(() => useRange("price"), { store })
        const { min, max, range, updateRange } = render.result.current
        expect(min).toBe(0)
        expect(max).toBe(100)
        expect(range).toEqual(expected.range)
        expect(updateRange).toBeInstanceOf(Function)
      })
    }

    testRangeState("should return range state", undefined, {
      range: [0, 100]
    })

    testRangeState(
      "updates range when only 'from' is specified in the filter",
      [{ field: "price", range: [{ gte: "0" }] }],
      {
        range: [0, 100]
      }
    )

    testRangeState(
      "updates range when only 'to' is specified in the filter",
      [{ field: "price", range: [{ lte: "50" }] }],
      {
        range: [0, 50]
      }
    )

    testRangeState(
      "updates range when both 'from' and 'to' are specified in the filter",
      [{ field: "price", range: [{ gte: "0", lte: "50" }] }],
      {
        range: [0, 50]
      }
    )

    testRangeState("handles undefined values", [{ field: "price", range: [{ gte: undefined, lte: undefined }] }], {
      range: [0, 100]
    })

    testRangeState("handles zero values", [{ field: "price", range: [{ gte: "0", lte: "0" }] }], {
      range: [0, 0]
    })

    testRangeState("handles negative values", [{ field: "price", range: [{ gte: "-10", lte: "-5" }] }], {
      range: [-10, -5]
    })
  })

  describe("edge cases", () => {
    it("rounds decimal values correctly", () => {
      const render = renderHookWithProviders(() => useRange("price"), { store })
      const { updateRange } = render.result.current

      // Test decimal values get properly rounded
      updateRange([10.7, 20.3])
      expect(actions.replaceFilter).toHaveBeenLastCalledWith("price", {
        gte: "10", // Math.floor(10.7)
        lte: "21" // Math.ceil(20.3)
      })
    })

    it("returns undefined when rounded values equal min/max boundaries", () => {
      const render = renderHookWithProviders(() => useRange("price"), { store })
      const { updateRange } = render.result.current

      // Test that values rounding to min/max return undefined (no filter needed)
      updateRange([0.1, 99.9])
      expect(actions.replaceFilter).toHaveBeenLastCalledWith("price", undefined)
      // Math.floor(0.1) = 0 (equals min), Math.ceil(99.9) = 100 (equals max)
    })

    it("handles partial filters when one value rounds to boundary", () => {
      const render = renderHookWithProviders(() => useRange("price"), { store })
      const { updateRange } = render.result.current

      // Test values that don't round to min/max
      updateRange([0.1, 50.5])
      expect(actions.replaceFilter).toHaveBeenLastCalledWith("price", {
        lte: "51" // Math.ceil(50.5), gte omitted because Math.floor(0.1) = 0 = min
      })
    })

    it("handles boundary values equal to min/max", () => {
      const render = renderHookWithProviders(() => useRange("price"), { store })
      const { updateRange } = render.result.current

      // When values equal min/max, should return undefined (no filter needed)
      updateRange([0, 100])
      expect(actions.replaceFilter).toHaveBeenLastCalledWith("price", undefined)

      updateRange([0, undefined])
      expect(actions.replaceFilter).toHaveBeenLastCalledWith("price", undefined)

      updateRange([undefined, 100])
      expect(actions.replaceFilter).toHaveBeenLastCalledWith("price", undefined)
    })

    it("handles values outside min/max range", () => {
      const render = renderHookWithProviders(() => useRange("price"), { store })
      const { updateRange } = render.result.current

      // Values outside range should still work
      updateRange([-50, 150])
      expect(actions.replaceFilter).toHaveBeenLastCalledWith("price", {
        gte: "-50",
        lte: "150"
      })

      updateRange([200, 300])
      expect(actions.replaceFilter).toHaveBeenLastCalledWith("price", {
        gte: "200",
        lte: "300"
      })
    })

    it("handles zero as valid value", () => {
      // Update store to have min/max range that includes zero
      store.updateState({
        response: {
          products: {
            size: 10,
            total: 100,
            hits: [],
            facets: [
              {
                name: "price",
                id: "price",
                field: "price",
                min: -10,
                max: 10,
                type: "stats"
              }
            ]
          }
        }
      })

      const render = renderHookWithProviders(() => useRange("price"), { store })
      const { updateRange } = render.result.current

      // Zero should be treated as a valid value, not falsy
      updateRange([0, 5])
      expect(actions.replaceFilter).toHaveBeenLastCalledWith("price", {
        gte: "0",
        lte: "5"
      })

      updateRange([0, 0])
      expect(actions.replaceFilter).toHaveBeenLastCalledWith("price", {
        gte: "0",
        lte: "0"
      })
    })

    it("handles malformed filter data", () => {
      // Test with malformed range filter
      store.updateState({
        query: {
          products: {
            filter: [{ field: "price", range: [] }] // Empty range array
          }
        }
      })

      const render1 = renderHookWithProviders(() => useRange("price"), { store })
      const { range: range1, active: active1 } = render1.result.current
      expect(range1).toEqual([0, 100])
      expect(active1).toBe(false)

      // Test with non-object range filter
      store.updateState({
        query: {
          products: {
            // @ts-expect-error - Testing malformed data
            filter: [{ field: "price", range: ["invalid"] }]
          }
        }
      })

      const render2 = renderHookWithProviders(() => useRange("price"), { store })
      const { range: range2, active: active2 } = render2.result.current
      expect(range2).toEqual([0, 100])
      expect(active2).toBe(false)
    })

    it("handles toggleActive functionality", () => {
      const render = renderHookWithProviders(() => useRange("price"), { store })
      const { active: initialActive, toggleActive } = render.result.current

      expect(initialActive).toBe(false)

      // Toggle should work even without state updates in test
      expect(toggleActive).toBeInstanceOf(Function)
    })

    it("handles very large numbers", () => {
      const render = renderHookWithProviders(() => useRange("price"), { store })
      const { updateRange } = render.result.current

      // Test with very large numbers
      updateRange([Number.MAX_SAFE_INTEGER - 1, Number.MAX_SAFE_INTEGER])
      expect(actions.replaceFilter).toHaveBeenLastCalledWith("price", {
        gte: "9007199254740990", // Math.floor(Number.MAX_SAFE_INTEGER - 1)
        lte: "9007199254740991" // Math.ceil(Number.MAX_SAFE_INTEGER)
      })
    })

    it("handles same from and to values", () => {
      const render = renderHookWithProviders(() => useRange("price"), { store })
      const { updateRange } = render.result.current

      // Same values should create a valid filter
      updateRange([50, 50])
      expect(actions.replaceFilter).toHaveBeenLastCalledWith("price", {
        gte: "50",
        lte: "50"
      })
    })

    it("handles inverted range (from > to)", () => {
      const render = renderHookWithProviders(() => useRange("price"), { store })
      const { updateRange } = render.result.current

      // Should still create filter even if from > to (backend might handle this)
      updateRange([80, 20])
      expect(actions.replaceFilter).toHaveBeenLastCalledWith("price", {
        gte: "80",
        lte: "20"
      })
    })
  })
})
