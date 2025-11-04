import { getRedirectUrl, searchWithRedirects } from "@core/withRedirects"
import { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { describe, expect, it, vi } from "vitest"

describe("withRedirects", () => {
  describe("getRedirectUrl", () => {
    it("should return redirect URL when query matches keyword with redirect", () => {
      const result: SearchResult = {
        keywords: {
          hits: [
            { keyword: "sale", _redirect: "https://example.com/sale", total: 10, priority: 1, facets: [] },
            { keyword: "discount", total: 5, priority: 2, facets: [] }
          ],
          total: 2
        }
      }

      const redirectUrl = getRedirectUrl("sale", result)
      expect(redirectUrl).toBe("https://example.com/sale")
    })

    it("should return redirect URL with case-insensitive matching", () => {
      const result: SearchResult = {
        keywords: {
          hits: [{ keyword: "SALE", _redirect: "https://example.com/sale", total: 10, priority: 1, facets: [] }],
          total: 1
        }
      }

      const redirectUrl = getRedirectUrl("sale", result)
      expect(redirectUrl).toBe("https://example.com/sale")
    })

    it("should return redirect URL with trimmed whitespace matching", () => {
      const result: SearchResult = {
        keywords: {
          hits: [{ keyword: "sale", _redirect: "https://example.com/sale", total: 10, priority: 1, facets: [] }],
          total: 1
        }
      }

      const redirectUrl = getRedirectUrl("  sale  ", result)
      expect(redirectUrl).toBe("https://example.com/sale")
    })

    it("should return undefined when query does not match any keyword", () => {
      const result: SearchResult = {
        keywords: {
          hits: [{ keyword: "sale", _redirect: "https://example.com/sale", total: 10, priority: 1, facets: [] }],
          total: 1
        }
      }

      const redirectUrl = getRedirectUrl("clearance", result)
      expect(redirectUrl).toBeUndefined()
    })

    it("should return undefined when keyword has no redirect", () => {
      const result: SearchResult = {
        keywords: {
          hits: [{ keyword: "sale", total: 10, priority: 1, facets: [] }],
          total: 1
        }
      }

      const redirectUrl = getRedirectUrl("sale", result)
      expect(redirectUrl).toBeUndefined()
    })

    it("should return undefined when query is empty", () => {
      const result: SearchResult = {
        keywords: {
          hits: [{ keyword: "sale", _redirect: "https://example.com/sale", total: 10, priority: 1, facets: [] }],
          total: 1
        }
      }

      const redirectUrl = getRedirectUrl("", result)
      expect(redirectUrl).toBeUndefined()
    })

    it("should return undefined when query is undefined", () => {
      const result: SearchResult = {
        keywords: {
          hits: [{ keyword: "sale", _redirect: "https://example.com/sale", total: 10, priority: 1, facets: [] }],
          total: 1
        }
      }

      const redirectUrl = getRedirectUrl(undefined, result)
      expect(redirectUrl).toBeUndefined()
    })

    it("should return undefined when result has no keywords", () => {
      const result: SearchResult = {}

      const redirectUrl = getRedirectUrl("sale", result)
      expect(redirectUrl).toBeUndefined()
    })

    it("should return undefined when keywords array is empty", () => {
      const result: SearchResult = {
        keywords: {
          hits: [],
          total: 0
        }
      }

      const redirectUrl = getRedirectUrl("sale", result)
      expect(redirectUrl).toBeUndefined()
    })
  })

  describe("searchWithRedirects", () => {
    it("should pass through to the search function", async () => {
      const mockSearchFn = vi.fn().mockResolvedValue({
        products: { hits: [] }
      })

      const query: SearchQuery = { query: "test" }
      const options = {}

      const result = await searchWithRedirects(query, options, mockSearchFn)

      expect(mockSearchFn).toHaveBeenCalledWith(query, options)
      expect(result).toEqual({ products: { hits: [] } })
    })
  })
})
