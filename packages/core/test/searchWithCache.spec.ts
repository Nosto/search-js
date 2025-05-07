import { SearchResultDto, STORAGE_ENTRY_NAME } from "@core/resultCaching"
import { searchWithCache } from "@core/withCache"
import { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { getSessionStorageItem } from "@utils/storage"
import { beforeEach, describe, expect, it, vi } from "vitest"

describe("searchWithCache", () => {
  const search = vi.fn()

  const resultDefault = { products: { hits: [{ name: "product 1" }], total: 2 } }

  type TestSearchOptiopns = {
    query: SearchQuery
    triggeredQuery?: SearchQuery
    expectedCache: SearchResultDto
    expectedResult: SearchResult
  }

  async function testSearch({ query, expectedCache, expectedResult: searchResult }: TestSearchOptiopns) {
    const response = await searchWithCache(query, { usePersistentCache: true }, search)
    expect(response).toEqual(searchResult)
    expect(getSessionStorageItem<SearchResultDto>(STORAGE_ENTRY_NAME)).toEqual(expectedCache)
  }

  async function testSearchTrigger({
    query,
    triggeredQuery,
    expectedCache,
    expectedResult: searchResult
  }: TestSearchOptiopns) {
    await testSearch({ query, expectedCache, expectedResult: searchResult })
    expect(search).toHaveBeenCalledWith(triggeredQuery ?? query, expect.anything())
    search.mockClear()
  }

  async function testSearchNoTrigger({ query, expectedCache, expectedResult: searchResult }: TestSearchOptiopns) {
    await testSearch({ query, expectedCache, expectedResult: searchResult })
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
      await testSearchTrigger({
        query: { products: { from: 0, size: 1 } },
        expectedCache: {
          query: {
            products: {
              from: 0,
              size: 1
            }
          },
          result: resultDefault
        },
        expectedResult: resultDefault
      })

      await testSearchTrigger({
        query: { products: { from: 1, size: 1 } },
        expectedCache: {
          query: {
            products: {
              from: 1,
              size: 1
            }
          },
          result: resultDefault
        },
        expectedResult: resultDefault
      })
    })

    it("should not call search when existing cache found", async () => {
      await testSearchTrigger({
        query: { products: { from: 0, size: 1 } },
        expectedCache: {
          query: {
            products: {
              from: 0,
              size: 1
            }
          },
          result: resultDefault
        },
        expectedResult: resultDefault
      })

      await testSearchNoTrigger({
        query: { products: { from: 0, size: 1 } },
        expectedCache: {
          query: {
            products: {
              from: 0,
              size: 1
            }
          },
          result: resultDefault
        },
        expectedResult: resultDefault
      })
    })

    it("should get from cache when size is less than cache size", async () => {
      const multipleResults = {
        products: {
          hits: [{ name: "product 1" }, { name: "product 2" }],
          total: 2
        }
      }

      search.mockResolvedValue(multipleResults)

      await testSearchTrigger({
        query: { products: { from: 0, size: 2 } },
        expectedCache: {
          query: {
            products: {
              from: 0,
              size: 2
            }
          },
          result: multipleResults
        },
        expectedResult: multipleResults
      })

      await testSearchNoTrigger({
        query: { products: { from: 0, size: 1 } },
        expectedCache: {
          query: {
            products: {
              from: 0,
              size: 1
            }
          },
          result: resultDefault
        },
        expectedResult: resultDefault
      })
    })

    it("should prefill from cache when requested size is more than cache size", async () => {
      await testSearchTrigger({
        query: { products: { from: 1, size: 1 } },
        expectedCache: {
          query: {
            products: {
              from: 1,
              size: 1
            }
          },
          result: resultDefault
        },
        expectedResult: resultDefault
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
          hits: [{ name: "product 1" }, ...newResult.products.hits]
        }
      }

      await testSearchTrigger({
        query: { products: { from: 1, size: 2 } },
        triggeredQuery: { products: { from: 2, size: 1 } },
        expectedCache: {
          query: {
            products: {
              from: 1,
              size: 2
            }
          },
          result: mergedResult
        },
        expectedResult: mergedResult
      })
    })
  })

  describe("infinite scroll", () => {
    it("should prefill result from cache on scroll", async () => {
      await testSearchTrigger({
        query: { products: { from: 0, size: 1 } },
        expectedCache: {
          query: {
            products: {
              from: 0,
              size: 1
            }
          },
          result: resultDefault
        },
        expectedResult: resultDefault
      })

      const newResult = { products: { hits: [{ name: "product 2" }], total: 2 } }

      search.mockResolvedValue(newResult)

      const mergedResult = {
        products: {
          hits: [{ name: "product 1" }, { name: "product 2" }],
          total: 2
        }
      }

      await testSearchTrigger({
        query: { products: { from: 0, size: 2 } },
        triggeredQuery: { products: { from: 1, size: 1 } },
        expectedCache: {
          query: {
            products: {
              from: 0,
              size: 2
            }
          },
          result: mergedResult
        },
        expectedResult: mergedResult
      })
    })

    it("should get from cache when size is less than cache size", async () => {
      const multipleResults = {
        products: {
          hits: [{ name: "product 1" }, { name: "product 2" }],
          total: 2
        }
      }

      search.mockResolvedValue(multipleResults)

      await testSearchTrigger({
        query: { products: { from: 0, size: 2 } },
        expectedCache: {
          query: {
            products: {
              from: 0,
              size: 2
            }
          },
          result: multipleResults
        },
        expectedResult: multipleResults
      })

      await testSearchNoTrigger({
        query: { products: { from: 0, size: 1 } },
        expectedCache: {
          query: {
            products: {
              from: 0,
              size: 1
            }
          },
          result: resultDefault
        },
        expectedResult: resultDefault
      })
    })
  })
})
