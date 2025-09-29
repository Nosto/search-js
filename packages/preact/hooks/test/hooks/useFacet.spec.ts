import type { SearchTermsFacet } from "@nosto/nosto-js/client"
import { useFacet } from "@preact/hooks/useFacet"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { mockActions, mockStore } from "../mocks/mocks"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

describe("useFacet", () => {
  const mockFacet = {
    id: "color",
    type: "terms" as const,
    name: "Color",
    field: "color",
    data: [
      { value: "Red", selected: true, count: 10 },
      { value: "Blue", selected: false, count: 5 },
      { value: "Green", selected: true, count: 7 }
    ]
  }
  const actions = mockActions()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should initialize with active set to true if there are selected filters", () => {
    // Create store with some filters to prevent global reset
    const store = mockStore({
      query: {
        products: {
          filter: [{ field: "color", value: ["red"] }]
        }
      }
    })
    const { result } = renderHookWithProviders(() => useFacet(mockFacet), { store })
    expect(result.current.active).toBe(true)
  })

  it("should initialize with active set to false if there are no selected filters", () => {
    const facetWithoutSelectedFilters = {
      ...mockFacet,
      data: [
        { value: "Red", selected: false, count: 10 },
        { value: "Blue", selected: false, count: 5 },
        { value: "Green", selected: false, count: 7 }
      ]
    }
    // Create store with some filters to prevent global reset
    const store = mockStore({
      query: {
        products: {
          filter: [{ field: "size", value: ["large"] }]
        }
      }
    })
    const { result } = renderHookWithProviders(() => useFacet(facetWithoutSelectedFilters), { store })
    expect(result.current.active).toBe(false)
  })

  it("should force active value if provided in options", () => {
    const facetWithoutSelectedFilters = {
      ...mockFacet,
      data: [
        { value: "Red", selected: false, count: 10 },
        { value: "Blue", selected: false, count: 5 },
        { value: "Green", selected: false, count: 7 }
      ]
    }
    // Create store with empty filters to test that explicit active option overrides global reset
    const store = mockStore({
      query: {
        products: {
          filter: []
        }
      }
    })
    const { result } = renderHookWithProviders(() => useFacet(facetWithoutSelectedFilters, { active: true }), { store })
    expect(result.current.active).toBe(true)
  })

  it("should return the correct selected filters count", () => {
    // Create store with some filters to prevent global reset
    const store = mockStore({
      query: {
        products: {
          filter: [{ field: "color", value: ["red"] }]
        }
      }
    })
    const { result } = renderHookWithProviders(() => useFacet(mockFacet), { store })
    expect(result.current.selectedFiltersCount).toBe(2)
  })

  it("should return 0 selected filters count if data not provided", () => {
    const facetWithoutFilters = {
      ...mockFacet,
      data: undefined
    }
    // Create store with some filters to prevent global reset
    const store = mockStore({
      query: {
        products: {
          filter: [{ field: "size", value: ["large"] }]
        }
      }
    })
    // @ts-expect-error Checking incorrect usage
    const { result } = renderHookWithProviders(() => useFacet(facetWithoutFilters), { store })
    expect(result.current.selectedFiltersCount).toBe(0)
  })

  it("should toggle active state when toggleActive is called", () => {
    // Create store with some filters to prevent global reset
    const store = mockStore({
      query: {
        products: {
          filter: [{ field: "color", value: ["red"] }]
        }
      }
    })
    const { result, rerender } = renderHookWithProviders(() => useFacet(mockFacet), { store })
    expect(result.current.active).toBe(true)
    result.current.toggleActive()
    rerender()
    expect(result.current.active).toBe(false)
    result.current.toggleActive()
    rerender()
    expect(result.current.active).toBe(true)
  })

  it("should call toggleProductFilter with the correct arguments when toggleProductFilter is called", () => {
    // Create store with some filters to prevent global reset
    const store = mockStore({
      query: {
        products: {
          filter: [{ field: "color", value: ["red"] }]
        }
      }
    })
    const { result } = renderHookWithProviders(() => useFacet(mockFacet), { store })
    result.current.toggleProductFilter("color", "Red", false)
    expect(actions.toggleProductFilter).toHaveBeenCalledWith("color", "Red", false)
  })

  it("should reset active state when all filters are cleared globally and no explicit active option is set", () => {
    // Create a store with filters applied
    const store = mockStore({
      loading: false,
      initialized: true,
      query: {
        products: {
          from: 0,
          filter: [
            {
              field: "color",
              value: ["red"]
            }
          ]
        }
      },
      response: {
        products: {
          facets: []
        }
      }
    })

    // Create a facet with selected filters
    const facetWithSelectedFilters = {
      ...mockFacet,
      data: [
        { value: "Red", selected: true, count: 10 },
        { value: "Blue", selected: false, count: 5 },
        { value: "Green", selected: false, count: 7 }
      ]
    }

    const { result, rerender } = renderHookWithProviders(() => useFacet(facetWithSelectedFilters), { store })

    // Initially active since facet has selected filters
    expect(result.current.active).toBe(true)
    expect(result.current.selectedFiltersCount).toBe(1)

    // Simulate clearing ALL filters globally (like calling removeAll())
    store.updateState({
      query: {
        products: {
          from: 0,
          filter: [] // Global filter array is now empty
        }
      }
    })

    rerender()

    // Should reset active state because global filters were cleared
    expect(result.current.active).toBe(false)
  })

  it("should not reset active state when individual facet filters are cleared but global filters remain", () => {
    // Create a store with multiple filters applied
    const store = mockStore({
      loading: false,
      initialized: true,
      query: {
        products: {
          from: 0,
          filter: [
            {
              field: "color",
              value: ["red"]
            },
            {
              field: "size",
              value: ["large"]
            }
          ]
        }
      },
      response: {
        products: {
          facets: []
        }
      }
    })

    // Create a facet with selected filters initially
    const facetWithSelectedFilters = {
      ...mockFacet,
      data: [
        { value: "Red", selected: true, count: 10 },
        { value: "Blue", selected: false, count: 5 },
        { value: "Green", selected: false, count: 7 }
      ]
    }

    const { result, rerender } = renderHookWithProviders(() => useFacet(facetWithSelectedFilters), { store })

    // Initially active
    expect(result.current.active).toBe(true)

    // Keep other filters in global state (simulate only clearing this facet's filters)
    store.updateState({
      query: {
        products: {
          from: 0,
          filter: [
            {
              field: "size",
              value: ["large"] // Other filters still exist
            }
          ]
        }
      }
    })

    rerender()

    // Should NOT reset active state because global filters are not empty
    expect(result.current.active).toBe(true)
  })

  it("should not reset active state when all filters are cleared but explicit active option is set", () => {
    // Create a store with filters applied
    const store = mockStore({
      loading: false,
      initialized: true,
      query: {
        products: {
          from: 0,
          filter: [
            {
              field: "color",
              value: ["red"]
            }
          ]
        }
      },
      response: {
        products: {
          facets: []
        }
      }
    })

    const facetWithSelectedFilters = {
      ...mockFacet,
      data: [
        { value: "Red", selected: true, count: 10 },
        { value: "Blue", selected: false, count: 5 },
        { value: "Green", selected: false, count: 7 }
      ]
    }

    const { result } = renderHookWithProviders(() => useFacet(facetWithSelectedFilters, { active: true }), { store })

    expect(result.current.active).toBe(true)

    // Clear all filters globally
    store.updateState({
      query: {
        products: {
          from: 0,
          filter: []
        }
      }
    })

    // Should remain active because explicit active: true was set
    expect(result.current.active).toBe(true)
  })

  it("should reset active state when used with useProductFilters removeAll integration", () => {
    // Create a store with filters applied
    const store = mockStore({
      loading: false,
      initialized: true,
      query: {
        products: {
          from: 0,
          filter: [
            {
              field: "color",
              value: ["red", "green"]
            }
          ]
        }
      },
      response: {
        products: {
          size: 10,
          total: 100,
          hits: [],
          facets: [
            {
              id: "color",
              type: "terms" as const,
              name: "Color",
              field: "color",
              data: [
                { value: "red", selected: true, count: 10 },
                { value: "green", selected: true, count: 7 },
                { value: "blue", selected: false, count: 5 }
              ]
            }
          ]
        }
      }
    })

    // Mock the actions (not used in this test but needed for rendering)
    mockActions()

    // Render facet hook with current facet state
    const facetRender = renderHookWithProviders(
      () => useFacet(store.getState().response.products?.facets?.[0] as SearchTermsFacet),
      { store }
    )

    // Initial state: facet should be active since it has selected filters
    expect(facetRender.result.current.active).toBe(true)
    expect(facetRender.result.current.selectedFiltersCount).toBe(2)

    // Simulate calling removeAll() which clears filters in the store
    store.updateState({
      query: {
        products: {
          from: 0,
          filter: []
        }
      },
      response: {
        products: {
          size: 10,
          total: 100,
          hits: [],
          facets: [
            {
              id: "color",
              type: "terms" as const,
              name: "Color",
              field: "color",
              data: [
                { value: "red", selected: false, count: 10 },
                { value: "green", selected: false, count: 7 },
                { value: "blue", selected: false, count: 5 }
              ]
            }
          ]
        }
      }
    })

    // Re-render facet with updated data from store
    facetRender.rerender()

    // After removeAll() equivalent, facet should no longer be active
    expect(facetRender.result.current.active).toBe(false)
    expect(facetRender.result.current.selectedFiltersCount).toBe(0)
  })
})
