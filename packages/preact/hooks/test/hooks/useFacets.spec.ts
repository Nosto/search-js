import { useFacets } from "@preact/hooks/useFacets"
import { describe, it } from "vitest"

import { expectStable } from "../mocks/expectStable"
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

  it("maintains consistent object values on re-render", () => {
    const render = renderHookWithProviders(() => useFacets(), { store })
    const firstRender = render.result.current
    
    // Force re-render without state change
    render.rerender()
    const secondRender = render.result.current
    
    // Object values should be consistent when state hasn't changed
    expectStable(firstRender, secondRender)
  })
})
