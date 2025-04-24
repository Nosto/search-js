import { mockNostojs } from "@nosto/nosto-js/testing"
import { searchWithCache } from "@preact/search/searchWithCache"
import { beforeEach, describe, expect, it, vi } from "vitest"

describe("searchWithCache", () => {
  const search = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    search.mockResolvedValue({ products: { hits: [{ name: "product 1" }] } })

    mockNostojs({ search })
    sessionStorage.clear()
    vi.spyOn(console, "info").mockImplementation(() => {})
  })

  it("should use cached results if available", async () => {
    const query = {
      products: { from: 0, size: 10 }
    }
    const result = await searchWithCache(query, true)
    expect(search).toHaveBeenCalledTimes(1)
    expect(result).toEqual({
      products: {
        hits: [{ name: "product 1" }]
      }
    })

    await searchWithCache(query, true)
    expect(search).toHaveBeenCalledTimes(1)
  })

  it("should handle undefined values in query", async () => {
    const query = {
      products: { from: undefined, size: 10 }
    }
    const result = await searchWithCache(query, true)
    expect(search).toHaveBeenCalledTimes(1)
    expect(result).toEqual({
      products: {
        hits: [{ name: "product 1" }]
      }
    })

    await searchWithCache(query, true)
    expect(search).toHaveBeenCalledTimes(1)
  })

  it("should skip cache for incomaptible query", async () => {
    const firstQuery = {
      products: { from: 0, size: 10 }
    }
    const firstResult = { products: { hits: [{ name: "first" }] } }
    search.mockResolvedValue(firstResult)
    const result1 = await searchWithCache(firstQuery, true)
    expect(search).toHaveBeenCalledTimes(1)
    expect(result1).toEqual(firstResult)

    const secondQuery = {
      products: { from: 10, size: 10 }
    }
    const secondResult = { products: { hits: [{ name: "second" }] } }
    search.mockResolvedValue(secondResult)
    const result2 = await searchWithCache(secondQuery, true)
    expect(search).toHaveBeenCalledTimes(2)
    expect(result2).toEqual(secondResult)
  })

  it("should merge cached and new results", async () => {
    const firstQuery = {
      products: { from: 0, size: 5 }
    }
    let hits = ["first", "second", "third", "fourth", "fifth"].map(name => ({ name }))
    search.mockResolvedValue({ products: { hits } })
    await searchWithCache(firstQuery, true)

    const secondQuery = {
      products: { from: 0, size: 10 }
    }
    hits = ["sixth", "seventh", "eighth", "ninth", "tenth"].map(name => ({ name }))
    search.mockResolvedValue({ products: { hits } })
    const result = await searchWithCache(secondQuery, true)
    expect(search).toHaveBeenCalledTimes(2)
    expect(result).toEqual({
      products: {
        hits: [
          { name: "first" },
          { name: "second" },
          { name: "third" },
          { name: "fourth" },
          { name: "fifth" },
          { name: "sixth" },
          { name: "seventh" },
          { name: "eighth" },
          { name: "ninth" },
          { name: "tenth" }
        ]
      }
    })
  })
})
