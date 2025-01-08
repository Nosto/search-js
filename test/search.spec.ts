import { describe, it, beforeEach, expect, vi } from "vitest"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { search, HitDecorator } from "../src"
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

  it("should handle empty search results", async () => {
    mockNostojs({
      search: vi.fn().mockResolvedValue({ products: { hits: [] } })
    })
    const result = await search(query)
    expect(result.products?.hits).toEqual([])
  })
})
