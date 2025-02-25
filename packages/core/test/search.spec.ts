import { search } from "@core/search"
import type { HitDecorator } from "@core/types"
import { SearchProduct, SearchQuery } from "@nosto/nosto-js/client"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { beforeEach, describe, expect, it, vi } from "vitest"

describe("search", () => {
  beforeEach(() => {
    mockNostojs({
      search: vi.fn().mockResolvedValue({
        products: {
          hits: [
            { id: "1", name: "Product 1" },
            { id: "2", name: "Product 2" }
          ]
        }
      })
    })
  })

  const query: SearchQuery = { query: "test" }

  it("should perform a search without decorators", async () => {
    const result = await search(query)
    expect(result.products?.hits).toEqual([
      { id: "1", name: "Product 1" },
      { id: "2", name: "Product 2" }
    ])
  })

  it("should apply hit decorators to the search results", async () => {
    const decorator: HitDecorator = (hit: SearchProduct) => ({
      ...hit,
      name: `${hit.name} Decorated`
    })
    const result = await search(query, { hitDecorators: [decorator] })
    expect(result.products?.hits).toEqual([
      { id: "1", name: "Product 1 Decorated" },
      { id: "2", name: "Product 2 Decorated" }
    ])
  })

  it("should infer the type of the decorated results", async () => {
    const decorator = (hit: SearchProduct) => ({
      ...hit,
      decorated: `${hit.name} Decorated`
    })

    const { products } = await search(query, { hitDecorators: [decorator] })
    expect(products?.hits[0].decorated).toBe("Product 1 Decorated")
  })

  it("should infer the type of the decorated results from multiple decorators", async () => {
    const decorator1 = (hit: SearchProduct) => ({
      ...hit,
      decorated1: `${hit.name} decorated 1`
    })
    const decorator2 = (hit: SearchProduct) => ({
      ...hit,
      decorated2: `${hit.name} decorated 2`
    })

    const { products } = await search(query, { hitDecorators: [decorator1, decorator2] })
    expect(products?.hits[0].decorated1).toBe("Product 1 decorated 1")
    expect(products?.hits[0].decorated2).toBe("Product 1 decorated 2")
  })

  it("should handle empty search results", async () => {
    mockNostojs({
      search: vi.fn().mockResolvedValue({ products: { hits: [] } })
    })
    const result = await search(query)
    expect(result.products?.hits).toEqual([])
  })

  describe("retries", () => {
    it("should retry search on fail", async () => {
      mockNostojs({
        search: vi
          .fn()
          .mockRejectedValueOnce(new Error("Network error"))
          .mockResolvedValueOnce({ products: { hits: [] } })
      })

      await search(query, { maxRetries: 1, retryInterval: 5 }).then(result => {
        expect(result.products?.hits).toEqual([])
      })
    })

    it("should throw error after max retries", async () => {
      mockNostojs({
        search: vi.fn().mockRejectedValue(new Error("Network error"))
      })

      await search(query, { maxRetries: 1, retryInterval: 5 }).catch(error => {
        expect(error.message).toBe("Network error")
      })
    })

    it("should skip retries for bad request error", async () => {
      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {})

      const error = new Error("Bad request")
      // @ts-expect-error purposefully setting status to 400
      error.status = 400
      mockNostojs({
        search: vi.fn().mockRejectedValue(error)
      })

      // Will time out if retries are attempted
      await search(query, { maxRetries: 10, retryInterval: 1000 }).catch(error => {
        expect(error.message).toBe("Bad request")
      })

      consoleSpy.mockRestore()
    })
  })
})
