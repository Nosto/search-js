import { clearMemoryCache, searchWithMemoryCache } from "@core/withMemoryCache"
import { SearchQuery } from "@nosto/nosto-js/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

describe("searchWithMemoryCache", () => {
  const search = vi.fn()

  const query: SearchQuery = { query: "shoes" }

  const result = {
    products: {
      hits: [{ id: "1", name: "product 1" }],
      total: 1,
      size: 1
    }
  }

  beforeEach(() => {
    vi.resetAllMocks()
    search.mockResolvedValue(result)
    clearMemoryCache()
  })

  it("should cache and reuse response if enableMemoryCache is true", async () => {
    const response = await searchWithMemoryCache(query, { enableMemoryCache: true }, search)
    expect(response).toEqual(result)
    expect(search).toHaveBeenCalledTimes(1)

    const cached = await searchWithMemoryCache(query, { enableMemoryCache: true }, search)
    expect(cached).toEqual(result)
    expect(search).toHaveBeenCalledTimes(1)
  })

  it("should not cache if enableMemoryCache is false", async () => {
    await searchWithMemoryCache(query, { enableMemoryCache: false }, search)
    await searchWithMemoryCache(query, { enableMemoryCache: false }, search)
    expect(search).toHaveBeenCalledTimes(2)
  })

  it("should expire cache after TTL", async () => {
    vi.useFakeTimers()
    const now = Date.now()
    vi.setSystemTime(now)

    await searchWithMemoryCache(query, { enableMemoryCache: true }, search)
    expect(search).toHaveBeenCalledTimes(1)

    vi.setSystemTime(now + 25000)
    vi.advanceTimersByTime(0)
    await searchWithMemoryCache(query, { enableMemoryCache: true }, search)
    expect(search).toHaveBeenCalledTimes(1)

    vi.setSystemTime(now + 31000)
    vi.advanceTimersByTime(0)
    await searchWithMemoryCache(query, { enableMemoryCache: true }, search)
    expect(search).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })

  it("should treat different queries independently", async () => {
    const otherQuery: SearchQuery = { query: "shirts" }

    await searchWithMemoryCache(query, { enableMemoryCache: true }, search)
    await searchWithMemoryCache(otherQuery, { enableMemoryCache: true }, search)

    expect(search).toHaveBeenCalledTimes(2)

    await searchWithMemoryCache(query, { enableMemoryCache: true }, search)
    await searchWithMemoryCache(otherQuery, { enableMemoryCache: true }, search)

    expect(search).toHaveBeenCalledTimes(2)
  })
})
