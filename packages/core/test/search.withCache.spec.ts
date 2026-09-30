import { STORAGE_ENTRY_NAME } from "@core/resultCaching"
import { searchWithPersistentCache } from "@core/withPersistentCache"
import { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { getSessionStorageItem } from "@utils/storage"
import { beforeEach, describe, expect, it, vi } from "vitest"

describe("searchWithCache", () => {
  const search = vi.fn()

  const mockNostojsApi = {
    recordSearch: vi.fn()
  }

  const resultDefault = { products: { hits: [{ name: "product 1" }], size: 1, total: 2 } }

  type TestSearchOptions = {
    query: SearchQuery
    result: SearchResult
    triggeredQuery?: SearchQuery
  }

  async function testSearch({ query, result }: TestSearchOptions) {
    const response = await searchWithPersistentCache(query, { usePersistentCache: true, track: "serp" }, search)
    expect(response).toEqual(result)
    expect(getSessionStorageItem(STORAGE_ENTRY_NAME)).toEqual({
      query,
      result,
      created: expect.any(Number)
    })
  }

  async function createCache({ ...options }: TestSearchOptions) {
    await testSearch(options)
    search.mockClear()
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
    mockNostojs(mockNostojsApi)
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

      expect(mockNostojsApi.recordSearch).not.toHaveBeenCalled()
    })

    it("should not call search when existing cache found, full page", async () => {
      await testSearchTriggered({
        query: { products: { from: 0, size: 1 } },
        result: resultDefault
      })

      await testSearchNotTriggered({
        query: { products: { from: 0, size: 1 } },
        result: resultDefault
      })
    })

    it("should call recordSearch when existing cache found, full page", async () => {
      const query = { products: { from: 0, size: 1 } }

      await createCache({ query, result: resultDefault })
      mockNostojsApi.recordSearch.mockClear()
      await testSearch({ query, result: resultDefault })

      expect(mockNostojsApi.recordSearch).toHaveBeenCalledTimes(1)
      expect(mockNostojsApi.recordSearch).toHaveBeenCalledWith("serp", query, resultDefault)
    })

    it("should not call search when existing cache found, partial page", async () => {
      const multipleResults = {
        products: {
          hits: [{ name: "product 1" }, { name: "product 2" }, { name: "product 3" }],
          size: 5,
          total: 3
        }
      }
      search.mockResolvedValue(multipleResults)

      await testSearchTriggered({
        query: { products: { from: 0, size: 5 } },
        result: multipleResults
      })

      await testSearchNotTriggered({
        query: { products: { from: 0, size: 5 } },
        result: multipleResults
      })
    })

    it("should call recordSearch when existing cache found, partial page", async () => {
      const multipleResults = {
        products: {
          hits: [{ name: "product 1" }, { name: "product 2" }, { name: "product 3" }],
          size: 5,
          total: 3
        }
      }
      search.mockResolvedValue(multipleResults)

      const query = { products: { from: 0, size: 5 } }
      await createCache({
        query,
        result: multipleResults
      })

      mockNostojsApi.recordSearch.mockClear()
      await testSearchNotTriggered({
        query,
        result: multipleResults
      })

      expect(mockNostojsApi.recordSearch).toHaveBeenCalledTimes(1)
      expect(mockNostojsApi.recordSearch).toHaveBeenCalledWith("serp", query, multipleResults)
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

    it("should backfill after all cached hits when requested size is more than cache size", async () => {
      const cachedResult = {
        products: {
          hits: [{ name: "product 3" }, { name: "product 4" }],
          size: 2,
          total: 6
        }
      }
      search.mockResolvedValue(cachedResult)

      await testSearchTriggered({
        query: { products: { from: 2, size: 2 } },
        result: cachedResult
      })

      const newResult = {
        products: {
          hits: [{ name: "product 5" }, { name: "product 6" }],
          total: 6
        }
      }
      search.mockResolvedValue(newResult)

      const mergedResult = {
        products: {
          hits: [...cachedResult.products.hits, ...newResult.products.hits],
          size: 4,
          total: 6
        }
      }

      await testSearchTriggered({
        query: { products: { from: 2, size: 4 } },
        triggeredQuery: { products: { from: 4, size: 2 } },
        result: mergedResult
      })
    })

    it("should drop tracking from the backfill request and record a single search event", async () => {
      const query = { products: { from: 0, size: 2 } }
      await createCache({ query: { products: { from: 0, size: 1 } }, result: resultDefault })
      search.mockResolvedValue({ products: { hits: [{ name: "product 2" }], total: 2 } })

      const result = await searchWithPersistentCache(query, { usePersistentCache: true, track: "serp" }, search)

      expect(search.mock.lastCall?.[0].track).toBeUndefined()
      expect(search.mock.lastCall?.[1].track).toBeUndefined()
      expect(mockNostojsApi.recordSearch).toHaveBeenCalledTimes(1)
      expect(mockNostojsApi.recordSearch).toHaveBeenCalledWith("serp", query, result)
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
