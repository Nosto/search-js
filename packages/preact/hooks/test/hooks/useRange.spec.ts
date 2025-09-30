import type { InputSearchFilter } from "@nosto/nosto-js/client"
import { useRange } from "@preact/hooks/useRange"
import { beforeEach, describe, expect, it } from "vitest"

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

  it("handles active state correctly", () => {
    // Test with no active filter - should be false
    const render1 = renderHookWithProviders(() => useRange("price"), { store })
    let { active } = render1.result.current

    // Test with active filter - should be true
    store.updateState({
      query: {
        products: {
          filter: [{ field: "price", range: [{ gte: "10", lte: "50" }] }]
        }
      }
    })
    const render2 = renderHookWithProviders(() => useRange("price"), { store })
    active = render2.result.current.active
    expect(active).toBe(true)

    // Test with partial filter (gte only) - should be true
    store.updateState({
      query: {
        products: {
          filter: [{ field: "price", range: [{ gte: "10" }] }]
        }
      }
    })
    const render3 = renderHookWithProviders(() => useRange("price"), { store })
    active = render3.result.current.active
    expect(active).toBe(true)

    // Test with partial filter (lte only) - should be true
    store.updateState({
      query: {
        products: {
          filter: [{ field: "price", range: [{ lte: "50" }] }]
        }
      }
    })
    const render4 = renderHookWithProviders(() => useRange("price"), { store })
    active = render4.result.current.active
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
})
