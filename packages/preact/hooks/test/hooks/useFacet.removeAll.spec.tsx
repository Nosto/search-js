import { useFacet } from "@preact/hooks/useFacet"
import { useProductFilters } from "@preact/hooks/useProductFilters/useProductFilters"
import { ConfigContext } from "@preact/common/config/configContext"
import { renderHook, waitFor } from "@testing-library/preact"
import { act, beforeEach, describe, expect, it, vi } from "vitest"

import { mockActions, mockStore } from "../mocks/mocks"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

describe("useFacet - removeAll integration", () => {
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
        hits: []
      }
    }
  })

  const mockConfig = {
    pageType: "search" as const,
    defaultCurrency: "EUR",
    queryModifications: (query: any) => query
  }

  const actions = mockActions()

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset store state
    store.updateState({
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
      }
    })
  })

  it("should reset facet active state to false when useProductFilters.removeAll is called", async () => {
    // Start with a facet that has selected filters matching the store state
    const activeFacet = {
      id: "color",
      type: "terms" as const,
      name: "Color", 
      field: "color",
      data: [
        { value: "red", selected: true, count: 10 },
        { value: "blue", selected: false, count: 5 },
        { value: "green", selected: true, count: 7 }
      ]
    }

    // Render both hooks in the same component context to test integration
    const renderResult = renderHookWithProviders(() => {
      const facetHook = useFacet(activeFacet)
      const productFiltersHook = useProductFilters()
      return {
        facet: facetHook,
        productFilters: productFiltersHook
      }
    }, { 
      store,
      wrapper: ({ children }) => (
        <ConfigContext value={mockConfig}>
          {children}
        </ConfigContext>
      )
    })

    const { result } = renderResult

    // Initially active because there are selected filters
    expect(result.current.facet.active).toBe(true)
    expect(result.current.facet.selectedFiltersCount).toBe(2)

    // Call removeAll and wait for event processing
    await act(async () => {
      result.current.productFilters.removeAll()
      await waitFor(() => {
        expect(result.current.facet.active).toBe(false)
      })
    })
    
    // Verify that updateSearch was called to clear filters
    expect(actions.updateSearch).toHaveBeenCalledWith({
      products: {
        filter: []
      }
    })
  })

  it("should not reset active state if options.active is explicitly set to true", () => {
    const renderResult = renderHookWithProviders(() => {
      const facetHook = useFacet(mockFacet, { active: true })
      const productFiltersHook = useProductFilters()
      return {
        facet: facetHook,
        productFilters: productFiltersHook
      }
    }, { 
      store,
      wrapper: ({ children }) => (
        <ConfigContext value={mockConfig}>
          {children}
        </ConfigContext>
      )
    })

    const { result, rerender } = renderResult

    // Initially active due to options
    expect(result.current.facet.active).toBe(true)

    // Call removeAll
    result.current.productFilters.removeAll()

    // Wait for the next render cycle and event processing
    rerender()

    // The facet should remain active because options.active is explicitly true
    expect(result.current.facet.active).toBe(true)
  })

  it("should reset active state when no filters are selected after removeAll", () => {
    // Start with a facet that has no selected filters
    const facetWithoutSelection = {
      ...mockFacet,
      data: [
        { value: "Red", selected: false, count: 10 },
        { value: "Blue", selected: false, count: 5 },
        { value: "Green", selected: false, count: 7 }
      ]
    }

    const renderResult = renderHookWithProviders(() => {
      const facetHook = useFacet(facetWithoutSelection)
      const productFiltersHook = useProductFilters()
      return {
        facet: facetHook,
        productFilters: productFiltersHook
      }
    }, { 
      store,
      wrapper: ({ children }) => (
        <ConfigContext value={mockConfig}>
          {children}
        </ConfigContext>
      )
    })

    const { result, rerender } = renderResult

    // Initially should be inactive
    expect(result.current.facet.active).toBe(false)

    // Manually activate it
    result.current.facet.toggleActive()
    rerender()
    expect(result.current.facet.active).toBe(true)

    // Call removeAll
    result.current.productFilters.removeAll()

    // Wait for the next render cycle and event processing
    rerender()

    // Should be reset to inactive
    expect(result.current.facet.active).toBe(false)
  })

  it("should reset active state when facet data changes from selected to unselected", () => {
    // Test the behavior when the actual facet data changes (simulating server response after filter removal)
    const { result, rerender } = renderHookWithProviders(() => useFacet(mockFacet), { 
      store,
      wrapper: ({ children }) => (
        <ConfigContext value={mockConfig}>
          {children}
        </ConfigContext>
      )
    })

    // Initially active because facet has selected filters
    expect(result.current.active).toBe(true)
    expect(result.current.selectedFiltersCount).toBe(2)

    // Simulate what happens when filters are cleared - facet data updates to show no selections
    const clearedFacet = {
      ...mockFacet,
      data: [
        { value: "Red", selected: false, count: 10 },
        { value: "Blue", selected: false, count: 5 },
        { value: "Green", selected: false, count: 7 }
      ]
    }

    // Re-render with the cleared facet data
    const { result: newResult } = renderHookWithProviders(() => useFacet(clearedFacet), { 
      store,
      wrapper: ({ children }) => (
        <ConfigContext value={mockConfig}>
          {children}
        </ConfigContext>
      )
    })

    // Should now be inactive since no filters are selected
    expect(newResult.current.active).toBe(false)
    expect(newResult.current.selectedFiltersCount).toBe(0)
  })
})