import { SearchProduct, SearchResult } from "@nosto/nosto-js/client"
import transformSearchResult from "@preact/hooks/useLoadMore/transformSearchResult"
import { describe, expect, it } from "vitest"

describe("transformSearchResults", () => {
  const previousResult: SearchResult = {
    products: {
      hits: [{ productId: "12345" }],
      total: 2,
      size: 1
    }
  }

  function test(expectedHits: SearchProduct[], newHits: SearchProduct[]) {
    const expected = {
      products: {
        hits: expectedHits,
        total: 2,
        from: 1,
        size: 1
      }
    }

    const newResult: SearchResult = {
      products: {
        hits: newHits,
        total: 2,
        from: 1,
        size: 1
      }
    }
    const result = transformSearchResult({ newResult, previousResult })
    expect(result).toEqual(expected)
  }

  it("should return hits in previous result when there are no hits in new result", () => {
    test([{ productId: "12345" }], [])
  })

  it("should merge hits from previous result into new result", () => {
    test([{ productId: "12345" }, { productId: "67890" }], [{ productId: "67890" }])
  })
})
