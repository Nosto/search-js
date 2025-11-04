import { searchWithRedirects } from "@core/withRedirects"
import { SearchQuery } from "@nosto/nosto-js/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

describe("searchWithRedirects", () => {
  const search = vi.fn()
  const query: SearchQuery = { query: "shoes" }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("should return response directly if redirect is false", async () => {
    const result = {
      products: {
        hits: [{ id: "1", name: "product 1" }],
        total: 1,
        size: 1
      }
    }
    search.mockResolvedValue(result)

    const response = await searchWithRedirects(query, { redirect: false }, search)
    expect(response).toEqual(result)
    expect(search).toHaveBeenCalledTimes(1)
  })

  it("should redirect if a matching keyword with _redirect is found", async () => {
    const redirectUrl = "https://example.com/redirect"
    const result = {
      keywords: {
        hits: [{ keyword: "shoes", _redirect: redirectUrl }, { keyword: "hats" }],
        total: 2,
        size: 2
      }
    }
    search.mockResolvedValue(result)

    // Mock window.location.href
    vi.stubGlobal("window", {
      location: {
        href: ""
      }
    })

    await searchWithRedirects(query, { redirect: true }, search)
    expect(window.location.href).toBe(redirectUrl)
    expect(search).toHaveBeenCalledTimes(1)
  })

  it("should not redirect if no matching keyword with _redirect is found", async () => {
    const result = {
      keywords: {
        hits: [{ keyword: "hats" }, { keyword: "bags" }],
        total: 2,
        size: 2
      }
    }
    search.mockResolvedValue(result)

    // Mock window.location.href
    vi.stubGlobal("window", {
      location: {
        href: ""
      }
    })

    const response = await searchWithRedirects(query, { redirect: true }, search)
    expect(window.location.href).toBe("")
    expect(response).toEqual(result)
    expect(search).toHaveBeenCalledTimes(1)
  })
})
