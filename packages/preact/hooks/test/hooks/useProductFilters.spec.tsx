import { useProductFilters } from "@preact/hooks/useProductFilters/useProductFilters"
import { ConfigContext } from "@preact/common/config/configContext"
import { dispatchNostoEvent } from "@preact/events/eventBusDispatch"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { mockActions, mockStore } from "../mocks/mocks"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

// Mock the event dispatch function
vi.mock("@preact/events/eventBusDispatch", () => ({
  dispatchNostoEvent: vi.fn()
}))

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
  const mockConfig = {
    pageType: "search" as const,
    defaultCurrency: "EUR",
    queryModifications: (query: any) => query
  }

  beforeEach(() => {
    vi.clearAllMocks()
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
    const render = renderHookWithProviders(() => useProductFilters(), { 
      store,
      wrapper: ({ children }) => (
        <ConfigContext value={mockConfig}>
          {children}
        </ConfigContext>
      )
    })
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
    const render = renderHookWithProviders(() => useProductFilters(), { 
      store,
      wrapper: ({ children }) => (
        <ConfigContext value={mockConfig}>
          {children}
        </ConfigContext>
      )
    })
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
              range: [{ gte: "0", lt: "10" }]
            }
          ]
        }
      }
    })
    const render = renderHookWithProviders(() => useProductFilters(), { 
      store,
      wrapper: ({ children }) => (
        <ConfigContext value={mockConfig}>
          {children}
        </ConfigContext>
      )
    })
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

  it("should accept numbers in filter range", () => {
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
    const render = renderHookWithProviders(() => useProductFilters(), { 
      store,
      wrapper: ({ children }) => (
        <ConfigContext value={mockConfig}>
          {children}
        </ConfigContext>
      )
    })
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

  it("should emit filters/removeAll event when removeAll is called", () => {
    const render = renderHookWithProviders(() => useProductFilters(), { 
      store,
      wrapper: ({ children }) => (
        <ConfigContext value={mockConfig}>
          {children}
        </ConfigContext>
      )
    })
    const { removeAll } = render.result.current

    removeAll()

    // Verify the event was dispatched with correct parameters
    expect(dispatchNostoEvent).toHaveBeenCalledWith({
      event: "filters/removeAll",
      params: {
        targetStore: "search"
      }
    })
  })
})
