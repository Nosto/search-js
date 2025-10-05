import { useRangeSelector } from "@preact/hooks/useRangeSelector"
import { afterEach, beforeEach, describe, it, vi } from "vitest"

import { expectStable } from "../mocks/expectStable"
import { mockActions, mockStore, resetStore } from "../mocks/mocks"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

describe("useRangeSelector", () => {
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
            min: 3,
            max: 420,
            type: "stats"
          }
        ]
      }
    }
  })

  beforeEach(async () => {
    resetStore(store)
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetModules()
  })

  it("correctly calculates ranges", () => {
    const render = renderHookWithProviders(() => useRangeSelector("price", 50), { store })
    const { ranges } = render.result.current
    expect(ranges.length).toBe(9)
    if (ranges[0]) {
      expect(ranges[0].min).toBe(0)
      expect(ranges[0].max).toBe(50)
      expect(ranges[0].selected).toBeFalsy()
    }
  })

  it("should correctly calculate ranges and selection based on filters", () => {
    store.updateState({
      query: {
        products: {
          filter: [
            {
              field: "price",
              range: [{ gte: "100", lte: "200" }]
            }
          ]
        }
      }
    })
    const render = renderHookWithProviders(() => useRangeSelector("price", 100), { store })
    const { ranges } = render.result.current

    expect(ranges.length).toBe(5)

    const expectedRanges = [
      { min: 0, max: 100, selected: false },
      { min: 100, max: 200, selected: true },
      { min: 200, max: 300, selected: false },
      { min: 300, max: 400, selected: false },
      { min: 400, max: 500, selected: false }
    ]

    expectedRanges.forEach((expectedRange, index) => {
      expect(ranges[index]).toEqual(expectedRange)
    })

    // expect the second range to be selected based on the active filter
    if (ranges[1]) {
      expect(ranges[1].selected).toBeTruthy()
    }

    // ensure no other ranges are selected
    expect(ranges.filter(r => r.selected).length).toBe(1)
  })

  it("responds to changes in filters from app state", () => {
    store.updateState({
      query: {
        products: {
          filter: [
            {
              field: "price",
              range: [{ gte: "20", lte: "40" }]
            }
          ]
        }
      }
    })
    const render = renderHookWithProviders(() => useRangeSelector("price", 20), { store })
    const { ranges } = render.result.current
    if (ranges[1]) {
      expect(ranges[1].selected).toBeTruthy()
    }
  })

  it("should initialize correctly with useRange values", () => {
    const render = renderHookWithProviders(() => useRangeSelector("price", 100), { store })
    const { min, max, ranges } = render.result.current

    expect(min).toBe(3)
    expect(max).toBe(420)
    expect(ranges.length).toBe(5)
    ranges.forEach((range, index) => {
      expect(range.min).toBe(index * 100)
      expect(range.max).toBe((index + 1) * 100)
    })
  })

  it("should update ranges when min values change", () => {
    const render = renderHookWithProviders(() => useRangeSelector("price", 100), { store })
    const { handleMinChange } = render.result.current

    handleMinChange(30)
    expect(actions.replaceFilter).toHaveBeenCalledWith("price", { gte: "30" })
  })

  it("should update ranges when max values change", () => {
    const render = renderHookWithProviders(() => useRangeSelector("price", 100), { store })
    const { handleMaxChange } = render.result.current

    handleMaxChange(350)
    expect(actions.replaceFilter).toHaveBeenCalledWith("price", { lte: "350" })
  })

  it("maintains consistent object values on re-render", () => {
    const render = renderHookWithProviders(() => useRangeSelector("price", 100), { store })
    const firstRender = render.result.current
    
    // Force re-render without state change
    render.rerender()
    const secondRender = render.result.current
    
    // Object values should be consistent when state hasn't changed
    expectStable(firstRender, secondRender)
  })
})
