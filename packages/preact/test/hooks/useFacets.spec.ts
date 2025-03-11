import { useFacets } from "@preact/hooks/useFacets"
import { describe, expect, it } from "vitest"

import { mockActions, mockStore } from "../mocks/mocks"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

describe("useFacets", () => {
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
          },
          {
            name: "color",
            id: "color",
            field: "color",
            type: "terms",
            data: [
              { value: "red", count: 10, selected: false },
              { value: "blue", count: 20, selected: false }
            ]
          }
        ]
      }
    }
  })
  const appState = store.getState()
  mockActions()

  it("returns facets from the response", () => {
    const { loading, facets } = renderHookWithProviders(() => useFacets(), { store }).result.current
    expect(loading).toBe(false)
    expect(facets).toEqual(appState.response.products?.facets)
  })
})
