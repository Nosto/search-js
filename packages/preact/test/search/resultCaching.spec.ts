import { cacheSearchResult, isValueShapeCorrect, loadCachedResultIfApplicable } from "@preact/search/resultCaching"
import { before } from "node:test"
import { describe, it, expect, vi, beforeEach } from "vitest"

describe("resultCaching", () => {
  beforeEach(() => {
    vi.clearAllMocks()
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

  describe("paginated caching", () => {
    beforeEach(() => {
      sessionStorage.clear()
    })

    it("cache and load search result", () => {
      cacheSearchResult(true, baseQuery, firstResult)

      const cacheData = loadCachedResultIfApplicable(true, {
        accountId: "test-account",
        products: { from: 5, size: 5 },
        query: "test-query"
      })

      expect(cacheData).toEqual(firstResult)
    })

    it("store and load multiple results into cache", () => {
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
        products: {
          hits: [
            {
              name: "First Product",
              productId: "1"
            },
            {
              name: "Second Product",
              productId: "2"
            }
          ],
          total: 2
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

  describe("simple caching", () => {
    it("caches and load search results", () => {
      cacheSearchResult(true, baseQuery, firstResult)

      const cacheData = loadCachedResultIfApplicable(true, {
        accountId: "test-account",
        products: { from: 0, size: 10 },
        query: "test-query"
      })

      expect(cacheData).toEqual(firstResult)
    })

    it("store and load multiple results into cache", () => {
      cacheSearchResult(true, baseQuery, firstResult)

      cacheSearchResult(
        true,
        {
          accountId: "test-account",
          products: { from: 0, size: 20 },
          query: "test-query"
        },
        secondResult
      )

      const cacheData = loadCachedResultIfApplicable(true, {
        accountId: "test-account",
        products: { from: 0, size: 20 },
        query: "test-query"
      })

      expect(cacheData).toEqual({
        products: {
          hits: [
            {
              name: "Second Product",
              productId: "2"
            }
          ],
          total: 2
        }
      })
    })

    it("doesn't load cache result when query is different", () => {
      cacheSearchResult(true, baseQuery, firstResult)

      cacheSearchResult(
        true,
        {
          accountId: "test-account",
          products: { from: 0, size: 20 },
          query: "test-query"
        },
        secondResult
      )

      const cacheData = loadCachedResultIfApplicable(true, {
        accountId: "test-account",
        products: { from: 0, size: 20 },
        query: "test-query-new"
      })

      expect(cacheData).toBeNull()
    })
  })
})
