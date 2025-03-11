import { useProductFilters } from "@preact/hooks/useProductFilters/useProductFilters"
import { describe, expect, it } from "vitest"

import { mockActions, mockStore } from "../mocks/mocks"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

describe("useProductFilters", () => {
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
        hits: []
      }
    }
  })
  mockActions()

  it("should return empty array if no filters", () => {
    store.updateState({
      query: {
        products: {
          filter: []
        }
      }
    })
    const render = renderHookWithProviders(() => useProductFilters(), { store })
    const { filters } = render.result.current
    expect(filters).toEqual([])
  })

  it("should return filters", () => {
    store.updateState({
      query: {
        products: {
          filter: [
            {
              field: "color",
              value: ["red", "green"]
            }
          ]
        }
      }
    })
    const render = renderHookWithProviders(() => useProductFilters(), { store })
    const { filters } = render.result.current
    expect(filters).toEqual([
      {
        value: "red",
        field: "color",
        name: "color",
        filter: { field: "color", value: ["red", "green"] },
        remove: expect.any(Function)
      },
      {
        value: "green",
        field: "color",
        name: "color",
        filter: { field: "color", value: ["red", "green"] },
        remove: expect.any(Function)
      }
    ])
  })

  it("should return the correct filter when from is 0", () => {
    store.updateState({
      query: {
        products: {
          filter: [
            {
              field: "quantity",
              // @ts-expect-error numbers used instead of strings
              range: [{ gte: 0, lt: 10 }]
            }
          ]
        }
      }
    })
    const render = renderHookWithProviders(() => useProductFilters(), { store })
    const { filters } = render.result.current
    expect(filters).toEqual([
      {
        value: "0 - 10",
        field: "quantity",
        name: "quantity",
        filter: { field: "quantity", range: [{ gte: 0, lt: 10 }] },
        remove: expect.any(Function)
      }
    ])
  })
})
