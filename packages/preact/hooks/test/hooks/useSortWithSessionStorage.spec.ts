import { useSortWithSessionStorage } from "@preact/hooks/useSort/useSortWithSessionStorage"
import { createSortOption } from "@preact/hooks/useSort/utils"
import { getSessionStorageItem, setSessionStorageItem } from "@utils/storage"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { expectStable } from "../mocks/expectStable"
import { mockActions, mockStore } from "../mocks/mocks"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

const sortStorageKey = "nosto:search-js:sort"

const sortOptions = [
  createSortOption("default", "Sort by"),
  createSortOption("score", "Most relevant", { field: "score", order: "desc" }),
  createSortOption("price-asc", "Price: Low to High", { field: "price", order: "asc" })
]

describe("useSortWithSessionStorage", () => {
  beforeEach(() => {
    // Clear session storage before each test
    window.sessionStorage.clear()
    vi.clearAllMocks()
  })

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

  it("returns correct initial values when no stored sort exists", () => {
    const { activeSort } = renderHookWithProviders(() => useSortWithSessionStorage(sortOptions), { store }).result
      .current
    expect(activeSort).toBe("default")
  })

  it("loads sort from session storage on mount", () => {
    setSessionStorageItem(sortStorageKey, "score")

    const testStore = mockStore({
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

    renderHookWithProviders(() => useSortWithSessionStorage(sortOptions), { store: testStore })

    expect(actions.updateSearch).toHaveBeenCalledWith({
      products: {
        sort: [{ field: "score", order: "desc" }]
      }
    })
  })

  it("does not update search if stored sort matches current sort", () => {
    setSessionStorageItem(sortStorageKey, "default")

    renderHookWithProviders(() => useSortWithSessionStorage(sortOptions), { store })

    // Should not call updateSearch since default is already active
    expect(actions.updateSearch).not.toHaveBeenCalled()
  })

  it("handles sort change correctly and saves to session storage", () => {
    const testStore = mockStore({
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

    const { result } = renderHookWithProviders(() => useSortWithSessionStorage(sortOptions), { store: testStore })

    result.current.setSort("score")

    expect(actions.updateSearch).toHaveBeenCalledWith({
      products: {
        sort: [{ field: "score", order: "desc" }]
      }
    })

    const storedSort = getSessionStorageItem<string>(sortStorageKey)
    expect(storedSort).toBe("score")
  })

  it("does not call updateSearch when selecting the same sort", () => {
    const { setSort, activeSort } = renderHookWithProviders(() => useSortWithSessionStorage(sortOptions), {
      store
    }).result.current

    expect(activeSort).toBe("default")
    expect(actions.updateSearch).not.toHaveBeenCalled()

    // Try to set the same sort
    setSort("default")

    // updateSearch should not have been called
    expect(actions.updateSearch).not.toHaveBeenCalled()
  })

  it("persists sort selection across component remounts", () => {
    const testStore = mockStore({
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

    // First mount: set a sort
    const { result: firstResult, unmount } = renderHookWithProviders(() => useSortWithSessionStorage(sortOptions), {
      store: testStore
    })
    firstResult.current.setSort("price-asc")

    expect(getSessionStorageItem<string>(sortStorageKey)).toBe("price-asc")

    unmount()

    // Clear the store state
    testStore.updateState({
      query: {
        products: {
          sort: []
        }
      }
    })

    // Second mount: should load from session storage
    renderHookWithProviders(() => useSortWithSessionStorage(sortOptions), { store: testStore })

    // updateSearch should have been called to restore the sort
    expect(actions.updateSearch).toHaveBeenCalledWith({
      products: {
        sort: [{ field: "price", order: "asc" }]
      }
    })
  })

  it("handles invalid stored sort gracefully", () => {
    setSessionStorageItem(sortStorageKey, "invalid-sort-id")

    const testStore = mockStore({
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

    const { activeSort } = renderHookWithProviders(() => useSortWithSessionStorage(sortOptions), {
      store: testStore
    }).result.current

    // Should default to first option when stored sort is invalid
    expect(activeSort).toBe("default")
    expect(actions.updateSearch).not.toHaveBeenCalled()
  })

  it("maintains consistent object values on re-render", () => {
    const testStore = mockStore({
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

    const render = renderHookWithProviders(() => useSortWithSessionStorage(sortOptions), { store: testStore })
    const firstRender = render.result.current

    render.rerender()
    const secondRender = render.result.current
    expectStable(firstRender, secondRender)
  })
})
