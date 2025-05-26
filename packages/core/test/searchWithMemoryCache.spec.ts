import { clearCache } from "@core/utils/memoryCache"
import { searchWithMemoryCache } from "@core/withMemoryCache"
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
    clearCache()
  })

  it("should call search and cache result when track is autocomplete", async () => {
    const response = await searchWithMemoryCache(query, { track: "autocomplete" }, search)
    expect(response).toEqual(result)
    expect(search).toHaveBeenCalledOnce()

    const cached = await searchWithMemoryCache(query, { track: "autocomplete" }, search)
    expect(cached).toEqual(result)
    expect(search).toHaveBeenCalledTimes(1)
  })

  it("should not cache when track is not autocomplete", async () => {
    await searchWithMemoryCache(query, { track: "serp" }, search)
    await searchWithMemoryCache(query, { track: "serp" }, search)
    expect(search).toHaveBeenCalledTimes(2)
  })

  it("should expire cache after TTL", async () => {
    vi.useFakeTimers()
    const now = Date.now()
    vi.setSystemTime(now)

    await searchWithMemoryCache(query, { track: "autocomplete" }, search)
    expect(search).toHaveBeenCalledTimes(1)

    vi.setSystemTime(now + 25000)
    await searchWithMemoryCache(query, { track: "autocomplete" }, search)
    expect(search).toHaveBeenCalledTimes(1) // still cached

    vi.setSystemTime(now + 31000)
    await searchWithMemoryCache(query, { track: "autocomplete" }, search)
    expect(search).toHaveBeenCalledTimes(2) // expired, re-fetched

    vi.useRealTimers()
  })

  it("should cache independently by query", async () => {
    const otherQuery: SearchQuery = { query: "shirts" }

    await searchWithMemoryCache(query, { track: "autocomplete" }, search)
    await searchWithMemoryCache(otherQuery, { track: "autocomplete" }, search)

    expect(search).toHaveBeenCalledTimes(2) // two different queries

    await searchWithMemoryCache(query, { track: "autocomplete" }, search)
    await searchWithMemoryCache(otherQuery, { track: "autocomplete" }, search)

    expect(search).toHaveBeenCalledTimes(2) // no additional calls
  })
})
