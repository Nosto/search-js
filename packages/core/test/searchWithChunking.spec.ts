import { searchWithChunking } from "@core/withChunking"
import { SearchQuery } from "@nosto/nosto-js/client"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { beforeEach, describe, expect, it, vi } from "vitest"

describe("searchWithChunking", () => {
  const search = vi.fn()

  const mockNostojsApi = {
    recordSearch: vi.fn()
  }

  beforeEach(() => {
    vi.resetAllMocks()
    search.mockImplementation(async (query: SearchQuery) => {
      const { from = 0, size = 0 } = query.products || {}
      return {
        products: {
          hits: Array.from({ length: size }, (_, i) => ({ productId: String(from + i) })),
          total: 1000,
          from,
          size
        }
      }
    })
    mockNostojs(mockNostojsApi)
  })

  it("should pass through queries within the limit as-is", async () => {
    const query: SearchQuery = { query: "shoes", products: { from: 0, size: 250 } }
    const options = { track: "serp" as const }
    await searchWithChunking(query, options, search)

    expect(search).toHaveBeenCalledTimes(1)
    expect(search).toHaveBeenCalledWith(query, options)
    expect(mockNostojsApi.recordSearch).not.toHaveBeenCalled()
  })

  it("should split large queries into chunks and combine the results", async () => {
    const query: SearchQuery = { query: "shoes", products: { from: 10, size: 600 } }
    const result = await searchWithChunking(query, {}, search)

    expect(search).toHaveBeenCalledTimes(3)
    expect(search.mock.calls.map(([q]) => q.products)).toEqual([
      { from: 10, size: 250 },
      { from: 260, size: 250 },
      { from: 510, size: 100 }
    ])
    expect(result.products?.from).toBe(10)
    expect(result.products?.size).toBe(600)
    expect(result.products?.total).toBe(1000)
    expect(result.products?.hits.map(hit => hit.productId)).toEqual(
      Array.from({ length: 600 }, (_, i) => String(10 + i))
    )
  })

  it("should stop requesting chunks once the total is reached", async () => {
    const query: SearchQuery = { query: "shoes", products: { from: 0, size: 1000 } }
    search.mockImplementation(async (query: SearchQuery) => {
      const { from = 0, size = 0 } = query.products || {}
      const length = Math.max(0, Math.min(size, 300 - from))
      return {
        products: {
          hits: Array.from({ length }, (_, i) => ({ productId: String(from + i) })),
          total: 300,
          from,
          size
        }
      }
    })
    const result = await searchWithChunking(query, {}, search)

    expect(search).toHaveBeenCalledTimes(2)
    expect(result.products?.hits).toHaveLength(300)
  })

  it("should request all chunks when the total is not provided", async () => {
    const query: SearchQuery = { query: "shoes", products: { from: 0, size: 600 } }
    search.mockImplementation(async (query: SearchQuery) => {
      const { from = 0, size = 0 } = query.products || {}
      return {
        products: {
          hits: Array.from({ length: size }, (_, i) => ({ productId: String(from + i) })),
          from,
          size
        }
      }
    })
    const result = await searchWithChunking(query, {}, search)

    expect(search).toHaveBeenCalledTimes(3)
    expect(result.products?.hits).toHaveLength(600)
  })

  it("should drop tracking from chunks and record a single search event", async () => {
    const query: SearchQuery = { query: "shoes", products: { size: 500 } }
    const result = await searchWithChunking(query, { track: "serp" }, search)

    expect(search).toHaveBeenCalledTimes(2)
    search.mock.calls.forEach(([, options]) => expect(options.track).toBeUndefined())
    expect(mockNostojsApi.recordSearch).toHaveBeenCalledTimes(1)
    expect(mockNostojsApi.recordSearch).toHaveBeenCalledWith("serp", query, result)
  })

  it("should not record a search event when tracking is not requested", async () => {
    await searchWithChunking({ query: "shoes", products: { size: 500 } }, {}, search)
    expect(mockNostojsApi.recordSearch).not.toHaveBeenCalled()
  })
})
