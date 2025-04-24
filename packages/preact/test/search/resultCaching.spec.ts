import { cacheSearchResult, isValueShapeCorrect, loadCachedResultIfApplicable } from "@preact/search/resultCaching"
import { describe, it, expect, vi, beforeEach } from "vitest"

describe("resultCaching", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  const firstResult = {
    products: {
      hits: [{ productId: "1", name: "First Product" }],
      total: 2
    }
  }

  const secondResult = {
    products: {
      hits: [{ productId: "2", name: "Second Product" }],
      total: 2
    }
  }

  const baseQuery = {
    accountId: "test-account",
    products: { from: 0, size: 10 },
    query: "test-query"
  }

  it("validates correct shape of SearchResultDto", () => {
    expect(isValueShapeCorrect(null)).toBe(false)
    expect(isValueShapeCorrect([])).toBe(false)
    expect(
      isValueShapeCorrect({
        query: {}
      })
    ).toBe(false)
    expect(
      isValueShapeCorrect({
        result: {}
      })
    ).toBe(false)
    expect(
      isValueShapeCorrect({
        query: {},
        result: {}
      })
    ).toBe(true)
  })

  it("caches and load first search result on page", () => {
    cacheSearchResult(true, baseQuery, firstResult)

    const cacheData = loadCachedResultIfApplicable(true, {
      accountId: "test-account",
      products: { from: 0, size: 10 },
      query: "test-query"
    })

    expect(cacheData).toEqual({
      query: {
        accountId: "test-account",
        products: {
          from: 0,
          size: 10
        },
        query: "test-query"
      },
      result: {
        ...firstResult
      }
    })
  })

  it("cache and retrieve search result when using pagination", () => {
    cacheSearchResult(true, baseQuery, firstResult)

    const cacheData = loadCachedResultIfApplicable(true, {
      accountId: "test-account",
      products: { from: 5, size: 5 },
      query: "test-query"
    })

    expect(cacheData).toEqual({
      query: {
        accountId: "test-account",
        products: {
          from: 0,
          size: 10
        },
        query: "test-query"
      },
      result: {
        ...firstResult
      }
    })
  })

  it("store latest result into cache and retrieve when using pagination", () => {
    cacheSearchResult(true, baseQuery, firstResult)

    cacheSearchResult(
      true,
      {
        accountId: "test-account",
        products: { from: 10, size: 10 },
        query: "test-query"
      },
      secondResult
    )

    const cacheData = loadCachedResultIfApplicable(true, {
      accountId: "test-account",
      products: { from: 10, size: 10 },
      query: "test-query"
    })

    expect(cacheData).toEqual({
      query: {
        accountId: "test-account",
        products: {
          from: 10,
          size: 10
        },
        query: "test-query"
      },
      result: {
        products: {
          hits: [
            {
              name: "Second Product",
              productId: "2"
            }
          ],
          total: 2
        }
      }
    })
  })

  it("doesn't load cache result when query is different", () => {
    cacheSearchResult(true, baseQuery, firstResult)

    cacheSearchResult(
      true,
      {
        accountId: "test-account",
        products: { from: 10, size: 10 },
        query: "test-query"
      },
      secondResult
    )

    const cacheData = loadCachedResultIfApplicable(true, {
      accountId: "test-account",
      products: { from: 20, size: 10 },
      query: "test-query-new"
    })

    expect(cacheData).toBeNull()
  })
})
