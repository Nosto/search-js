import { useSelectedFiltersCount } from "@preact/hooks/useSelectedFiltersCount"
import { beforeEach, describe, expect, it } from "vitest"

import { mockActions, mockStore } from "../mocks/mocks"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

describe("useSelectedFiltersCount", () => {
  let store: ReturnType<typeof mockStore>

  beforeEach(() => {
    store = mockStore({
      loading: false,
      initialized: true,
      query: {
        products: {
          filter: []
        }
      }
    })
    mockActions()
  })

  it("returns 0 if no filters are present", () => {
    const render = renderHookWithProviders(() => useSelectedFiltersCount(), { store })
    const filterCount = render.result.current
    expect(filterCount).toBe(0)
  })

  it("returns correct number when filters are present", () => {
    store.updateState({
      query: {
        products: {
          filter: [
            {
              field: "brand",
              value: ["123"]
            },
            {
              field: "color",
              value: ["blue"]
            }
          ]
        }
      }
    })
    const render = renderHookWithProviders(() => useSelectedFiltersCount(), { store })
    const filterCount = render.result.current
    expect(filterCount).toBe(2)
  })

  it("returns 0 when filters are cleared (newSearch behavior)", () => {
    // First, set some filters
    store.updateState({
      query: {
        products: {
          filter: [
            {
              field: "brand",
              value: ["nike"]
            },
            {
              field: "color",
              value: ["red", "blue"]
            }
          ]
        }
      }
    })

    const render = renderHookWithProviders(() => useSelectedFiltersCount(), { store })
    expect(render.result.current).toBe(3) // nike + red + blue = 3 filters

    // Simulate what should happen after newSearch clears filters
    store.updateState({
      query: {
        products: {
          filter: []
        }
      }
    })

    render.rerender()
    expect(render.result.current).toBe(0)
  })

  it("correctly handles array values in filters", () => {
    store.updateState({
      query: {
        products: {
          filter: [
            {
              field: "color",
              value: ["red", "blue", "green"]
            },
            {
              field: "size",
              value: ["M"]
            }
          ]
        }
      }
    })
    const render = renderHookWithProviders(() => useSelectedFiltersCount(), { store })
    const filterCount = render.result.current
    expect(filterCount).toBe(4) // 3 colors + 1 size = 4 filters
  })
})
