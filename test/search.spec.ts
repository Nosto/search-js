import { describe, it, beforeEach, expect, vi } from "vitest"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { search } from "../src"
import { SearchQuery, SearchProduct } from "@nosto/nosto-js/client"

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
    const decorator = (hit: SearchProduct) => ({
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
})
