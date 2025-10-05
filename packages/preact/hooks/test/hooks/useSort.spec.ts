import { useSort } from "@preact/hooks/useSort/useSort"
import { createSortOption, isMatchingSort } from "@preact/hooks/useSort/utils"
import { describe, expect, it } from "vitest"

import { mockActions, mockStore } from "../mocks/mocks"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

const sortOptions = [
  createSortOption("default", "Sort by"),
  createSortOption("score", "Most relevant", { field: "score", order: "desc" })
]

describe("useSort", () => {
  const store = mockStore({
    loading: false,
    initialized: true,
    query: {
      products: {
        sort: []
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

  const actions = mockActions()

  it("returns correct sort options creations", () => {
    const sortOption = createSortOption("default", "Sort by")
    expect(sortOption).toEqual({ id: "default", value: { name: "Sort by", sort: [] } })
    const sortOptionScore = createSortOption("score", "Most relevant", { field: "score", order: "desc" })
    expect(sortOptionScore).toEqual({
      id: "score",
      value: {
        name: "Most relevant",
        sort: [
          {
            field: "score",
            order: "desc"
          }
        ]
      }
    })
  })
  it("returns correct initial values", () => {
    const { activeSort } = renderHookWithProviders(() => useSort(sortOptions), { store }).result.current
    expect(activeSort).toBe("default")
  })

  it("handles sort change correctly", () => {
    const { setSort } = renderHookWithProviders(() => useSort(sortOptions), { store }).result.current

    setSort("score")
    expect(actions.updateSearch).toHaveBeenCalledWith({
      products: {
        sort: [{ field: "score", order: "desc" }]
      }
    })
    setSort("default")
    expect(actions.updateSearch).toHaveBeenCalledWith({
      products: {
        sort: []
      }
    })
  })

  it("returns correct matching sort", () => {
    const scoreSortOpt = createSortOption("score", "Most relevant", { field: "score", order: "asc" })
    const scoreSortQry = createSortOption("score", "Most relevant", { field: "score", order: "asc" })
    const scoreSortDesc = createSortOption("score", "Most relevant", { field: "score", order: "desc" })
    expect(isMatchingSort(scoreSortOpt.value.sort, scoreSortQry.value.sort)).toBe(true)
    expect(isMatchingSort(scoreSortOpt.value.sort, scoreSortDesc.value.sort)).toBe(false)
    expect(isMatchingSort(scoreSortOpt.value.sort, [])).toBe(false)
    expect(isMatchingSort([], [])).toBe(true)
  })

  it("maintains object reference stability on re-render", () => {
    const sortOptions = [
      { id: "price-asc", value: { name: "Price: Low to High", sort: [{ field: "price", order: "asc" as const }] } },
      { id: "price-desc", value: { name: "Price: High to Low", sort: [{ field: "price", order: "desc" as const }] } }
    ]

    const render = renderHookWithProviders(() => useSort(sortOptions), { store })
    const firstRender = render.result.current
    
    // Force re-render without state change
    render.rerender()
    const secondRender = render.result.current
    
    // Object reference should be stable when state hasn't changed
    expect(firstRender).toBe(secondRender)
  })
})
