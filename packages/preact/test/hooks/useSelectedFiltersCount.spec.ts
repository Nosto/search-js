import { useSelectedFiltersCount } from "@preact/hooks/useSelectedFiltersCount"
import { describe, expect, it } from "vitest"

import { mockActions, mockStore } from "../mocks/mocks"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

describe("useSelectedFiltersCount", () => {
  const store = mockStore({
    loading: false,
    initialized: true,
    query: {
      products: {
        filter: []
      }
    }
  })
  mockActions()

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
})
