import { SearchResult } from "@nosto/nosto-js/client"
import { mergeProductHits } from "@preact/hooks/useLoadMore/transformSearchResult"
import { describe, expect, it } from "vitest"

describe("transformSearchResults", () => {
  it("should return hits in previous result when there are no hits in new result", () => {
    const previousResult: SearchResult = {
      products: {
        hits: [{ productId: "12345" }],
        total: 2,
        size: 1
      }
    }

    const newResult: SearchResult = {
      products: {
        hits: [],
        total: 2,
        from: 1,
        size: 1
      }
    }

    const result = mergeProductHits(previousResult, newResult)

    expect(result).toEqual({
      products: {
        hits: [{ productId: "12345" }],
        total: 2,
        from: 1,
        size: 1
      }
    })
  })
  it("should merge hits from previous result into new result", () => {
    const previousResult: SearchResult = {
      products: {
        hits: [{ productId: "12345" }],
        total: 2,
        size: 1
      }
    }

    const newResult: SearchResult = {
      products: {
        hits: [{ productId: "67890" }],
        total: 2,
        from: 1,
        size: 1
      }
    }

    const result = mergeProductHits(previousResult, newResult)

    expect(result).toEqual({
      products: {
        hits: [{ productId: "12345" }, { productId: "67890" }],
        total: 2,
        from: 1,
        size: 1
      }
    })
  })
})
