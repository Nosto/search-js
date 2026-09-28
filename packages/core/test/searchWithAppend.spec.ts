import { searchWithAppend } from "@core/withAppend"
import { SearchQuery } from "@nosto/nosto-js/client"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { beforeEach, describe, expect, it, vi } from "vitest"

describe("searchWithAppend", () => {
  const search = vi.fn()

  const mockNostojsApi = {
    recordSearch: vi.fn()
  }

  function productQuery(size: number, from = 0): SearchQuery {
    return { query: "shoes", products: { from, size } }
  }

  beforeEach(() => {
    vi.resetAllMocks()
    search.mockImplementation(async (query: SearchQuery) => {
      const from = query.products?.from ?? 0
      const size = query.products?.size ?? 0
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

  it("should pass through the first query as-is", async () => {
    const options = { track: "serp" as const }
    await searchWithAppend(productQuery(100), options, search)

    expect(search).toHaveBeenCalledTimes(1)
    expect(search).toHaveBeenCalledWith(productQuery(100), options)
    expect(mockNostojsApi.recordSearch).not.toHaveBeenCalled()
  })

  it("should request only the missing tail and append it to the cached result", async () => {
    await searchWithAppend(productQuery(100), {}, search)
    const result = await searchWithAppend(productQuery(120), {}, search)

    expect(search).toHaveBeenCalledTimes(2)
    expect(search).toHaveBeenLastCalledWith(productQuery(20, 100), {})
    expect(result.products?.from).toBe(0)
    expect(result.products?.size).toBe(120)
    expect(result.products?.hits.map(hit => hit.productId)).toEqual(Array.from({ length: 120 }, (_, i) => String(i)))
  })

  it("should keep appending to the updated cache", async () => {
    await searchWithAppend(productQuery(100), {}, search)
    await searchWithAppend(productQuery(120), {}, search)
    const result = await searchWithAppend(productQuery(150), {}, search)

    expect(search).toHaveBeenLastCalledWith(productQuery(30, 120), {})
    expect(result.products?.hits).toHaveLength(150)
  })

  it("should respect a non-zero from", async () => {
    await searchWithAppend(productQuery(100, 50), {}, search)
    const result = await searchWithAppend(productQuery(120, 50), {}, search)

    expect(search).toHaveBeenLastCalledWith(productQuery(20, 150), {})
    expect(result.products?.from).toBe(50)
    expect(result.products?.hits[0].productId).toBe("50")
    expect(result.products?.hits).toHaveLength(120)
  })

  it("should drop tracking from the tail request and record a single search event", async () => {
    await searchWithAppend(productQuery(100), {}, search)
    const result = await searchWithAppend(productQuery(120), { track: "serp" }, search)

    expect(search.mock.lastCall?.[1].track).toBeUndefined()
    expect(mockNostojsApi.recordSearch).toHaveBeenCalledTimes(1)
    expect(mockNostojsApi.recordSearch).toHaveBeenCalledWith("serp", productQuery(120), result)
  })

  it("should do a full request after a failed search", async () => {
    await searchWithAppend(productQuery(100), {}, search)
    search.mockRejectedValueOnce(new Error("failed"))
    await expect(searchWithAppend(productQuery(120), {}, search)).rejects.toThrow("failed")

    await searchWithAppend(productQuery(120), {}, search)
    expect(search).toHaveBeenLastCalledWith(productQuery(120), {})
  })

  it("should not append when the query differs", async () => {
    await searchWithAppend(productQuery(100), {}, search)
    const query = { ...productQuery(120), query: "boots" }
    await searchWithAppend(query, {}, search)

    expect(search).toHaveBeenLastCalledWith(query, {})
  })

  it("should not append when from differs", async () => {
    await searchWithAppend(productQuery(100), {}, search)
    await searchWithAppend(productQuery(120, 10), {}, search)

    expect(search).toHaveBeenLastCalledWith(productQuery(120, 10), {})
  })

  it("should not append when requesting fewer or the same number of products", async () => {
    await searchWithAppend(productQuery(100), {}, search)
    await searchWithAppend(productQuery(100), {}, search)
    await searchWithAppend(productQuery(80), {}, search)

    expect(search).toHaveBeenCalledTimes(3)
    expect(search).toHaveBeenNthCalledWith(2, productQuery(100), {})
    expect(search).toHaveBeenNthCalledWith(3, productQuery(80), {})
  })
})
