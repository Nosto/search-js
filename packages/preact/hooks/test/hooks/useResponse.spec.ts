import { useResponse } from "@preact/hooks/useResponse"
import { describe, it } from "vitest"

import { expectStable } from "../mocks/expectStable"
import { mockActions, mockStore } from "../mocks/mocks"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

describe("useResponse", () => {
  const store = mockStore({
    loading: false,
    initialized: true,
    query: {
      products: {
        from: 0
      },
      keywords: {
        size: 5,
        highlight: {
          preTag: "<strong>",
          postTag: "</strong>"
        },
        fields: ["name"],
        facets: ["brand"]
      }
    },
    response: {
      keywords: {
        hits: [
          {
            keyword: "indigo denim jeans",
            _highlight: {
              keyword: "indigo denim <strong>jean</strong>s"
            },
            facets: [],
            priority: 1,
            total: 1
          }
        ],
        total: 1,
        size: 5
      },
      products: {
        hits: [
          {
            productId: "6864203776078",
            url: "",
            name: "Recover™ Slim Fit Indigo Denim Jeans",
            imageUrl: "",
            thumbUrl: "",
            brand: "Perry Ellis",
            availability: "InStock",
            price: 29.98,
            listPrice: 98,
            ratingValue: 4.9,
            reviewCount: 14
          }
        ],
        total: 14,
        size: 4
      }
    }
  })
  const appState = store.getState()
  mockActions()

  it("returns autocomplete from the response", () => {
    const render = renderHookWithProviders(() => useResponse(), { store })
    const { keywords, products } = render.result.current
    expect(keywords).toEqual(appState.response.keywords)
    expect(products).toEqual(appState.response.products)
  })

  it("maintains consistent object values on re-render", () => {
    const render = renderHookWithProviders(() => useResponse(), { store })
    const firstRender = render.result.current
    
    // Force re-render without state change
    render.rerender()
    const secondRender = render.result.current
    
    // Object values should be consistent when state hasn't changed
    expectStable(firstRender, secondRender)
  })
})
