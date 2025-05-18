import { STORAGE_ENTRY_NAME } from "@core/resultCaching"
import { searchWithCache } from "@core/withCache"
import { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { getSessionStorageItem } from "@utils/storage"
import { beforeEach, describe, expect, it, vi } from "vitest"

describe("searchWithCache", () => {
  const search = vi.fn()

  const resultDefault = { products: { hits: [{ name: "product 1" }], size: 1, total: 2 } }

  type TestSearchOptions = {
    query: SearchQuery
    result: SearchResult
    triggeredQuery?: SearchQuery
  }

  async function testSearch({ query, result }: TestSearchOptions) {
    const response = await searchWithCache(query, { usePersistentCache: true }, search)
    expect(response).toEqual(result)
    expect(getSessionStorageItem(STORAGE_ENTRY_NAME)).toEqual({
      query,
      result,
      created: expect.any(Number)
    })
  }

  async function testSearchTriggered({ triggeredQuery, ...options }: TestSearchOptions) {
    await testSearch(options)
    expect(search).toHaveBeenCalledWith(triggeredQuery ?? options.query, expect.anything())
    search.mockClear()
  }

  async function testSearchNotTriggered(options: TestSearchOptions) {
    await testSearch(options)
    expect(search).not.toHaveBeenCalled()
    search.mockClear()
  }

  beforeEach(() => {
    vi.resetAllMocks()
    search.mockResolvedValue(resultDefault)

    sessionStorage.clear()
    vi.spyOn(console, "info").mockImplementation(() => {})
  })

  describe("pagination", () => {
    it("should call search when existing cache not found", async () => {
      await testSearchTriggered({
        query: { products: { from: 0, size: 1 } },
        result: resultDefault
      })

      await testSearchTriggered({
        query: { products: { from: 1, size: 1 } },
        result: resultDefault
      })
    })

    it("should not call search when existing cache found", async () => {
      await testSearchTriggered({
        query: { products: { from: 0, size: 1 } },
        result: resultDefault
      })

      await testSearchNotTriggered({
        query: { products: { from: 0, size: 1 } },
        result: resultDefault
      })
    })

    it("should call search when existing cache entry is expired", async () => {
      vi.spyOn(Date, "now").mockReturnValue(0)
      await testSearchTriggered({
        query: { products: { from: 0, size: 1 } },
        result: resultDefault
      })

      vi.spyOn(Date, "now").mockReturnValue(120 * 1000) // 2 minutes later
      await testSearchTriggered({
        query: { products: { from: 0, size: 1 } },
        result: resultDefault
      })
    })

    it("should get from cache when size is less than cache size", async () => {
      const multipleResults = {
        products: {
          hits: [{ name: "product 1" }, { name: "product 2" }],
          size: 2,
          total: 2
        }
      }

      search.mockResolvedValue(multipleResults)

      await testSearchTriggered({
        query: { products: { from: 0, size: 2 } },
        result: multipleResults
      })

      await testSearchNotTriggered({
        query: { products: { from: 0, size: 1 } },
        result: resultDefault
      })
    })

    it("should prefill from cache when requested size is more than cache size", async () => {
      await testSearchTriggered({
        query: { products: { from: 1, size: 1 } },
        result: resultDefault
      })

      const newResult = {
        products: {
          hits: [{ name: "product 2" }],
          total: 2
        }
      }

      search.mockResolvedValue(newResult)

      const mergedResult = {
        ...newResult,
        products: {
          ...newResult.products,
          size: 2,
          hits: [{ name: "product 1" }, ...newResult.products.hits]
        }
      }

      await testSearchTriggered({
        query: { products: { from: 1, size: 2 } },
        triggeredQuery: { products: { from: 2, size: 1 } },
        result: mergedResult
      })
    })
  })

  describe("infinite scroll", () => {
    it("should prefill result from cache on scroll", async () => {
      await testSearchTriggered({
        query: { products: { from: 0, size: 1 } },
        result: resultDefault
      })

      const newResult = { products: { hits: [{ name: "product 2" }], total: 2 } }

      search.mockResolvedValue(newResult)

      const mergedResult = {
        products: {
          hits: [{ name: "product 1" }, { name: "product 2" }],
          size: 2,
          total: 2
        }
      }

      await testSearchTriggered({
        query: { products: { from: 0, size: 2 } },
        triggeredQuery: { products: { from: 1, size: 1 } },
        result: mergedResult
      })
    })

    it("should get from cache when size is less than cache size", async () => {
      const multipleResults = {
        products: {
          hits: [{ name: "product 1" }, { name: "product 2" }],
          size: 2,
          total: 2
        }
      }

      search.mockResolvedValue(multipleResults)

      await testSearchTriggered({
        query: { products: { from: 0, size: 2 } },
        result: multipleResults
      })

      await testSearchNotTriggered({
        query: { products: { from: 0, size: 1 } },
        result: resultDefault
      })
    })
  })
})
