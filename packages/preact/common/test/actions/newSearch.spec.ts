import { SearchQuery } from "@nosto/nosto-js/client"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { newSearch } from "@preact/common/actions/newSearch"
import { createStore } from "@preact/common/store/store"
import { makeSerpConfig } from "@preact/serp/SerpConfig"
import { loadSavedScroll, restoreSavedScroll } from "@utils/pageScroll/restorePageScroll"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock(import("@utils/pageScroll/restorePageScroll"))

describe("newSearch", () => {
  const search = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    search.mockResolvedValue({ products: { hits: [{ name: "product 1" }] } })

    mockNostojs({
      search
    })

    sessionStorage.clear()
    vi.spyOn(console, "info").mockImplementation(() => {})
  })

  it("commits state properly", async () => {
    const context = {
      config: makeSerpConfig(),
      store: createStore({
        loading: false
      })
    }

    const query = { products: { from: 0 } }
    const promise = newSearch(context, query)
    expect(context.store.getState().loading).toBe(true)
    expect(context.store.getState().response).toEqual({})

    await promise

    expect(context.store.getState().loading).toBe(false)
    expect(context.store.getState().response).toEqual({
      products: {
        hits: [{ name: "product 1" }]
      }
    })
  })

  it("invokes onBeforeSearch before the operation", async () => {
    const onBeforeSearch = vi.fn()
    const context = {
      config: makeSerpConfig({
        onBeforeSearch
      }),
      store: createStore({
        loading: false
      })
    }

    const query = { products: { from: 0 } }
    await newSearch(context, query)
    expect(onBeforeSearch).toHaveBeenCalled()
  })

  it("respects the track option when provided", async () => {
    const context = {
      config: makeSerpConfig(),
      store: createStore({
        loading: false
      })
    }

    const query = { products: { from: 0 } }
    await newSearch(context, query, { track: "autocomplete" })

    expect(search).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ track: "autocomplete" }))
  })

  it("applies the default track when track is true", async () => {
    const context = {
      config: makeSerpConfig(),
      store: createStore({
        loading: false
      })
    }

    const query = { products: { from: 0 } }
    await newSearch(context, query, { track: true })

    expect(search).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ track: "serp" }))
  })

  it("disables tracking when track is false", async () => {
    const context = {
      config: makeSerpConfig(),
      store: createStore({
        loading: false
      })
    }

    const query = { products: { from: 0 } }
    await newSearch(context, query, { track: false })

    expect(search).toHaveBeenCalledTimes(1)
    expect(search.mock.calls[0][1].track).toBeUndefined()
  })

  it("invokes onSearchError on error", async () => {
    const onSearchError = vi.fn()
    const context = {
      config: makeSerpConfig({
        onSearchError
      }),
      store: createStore({
        loading: false
      })
    }

    const query = { products: { from: 0 } }
    search.mockRejectedValue(new Error("Search error"))
    await newSearch(context, query)
    expect(onSearchError).toHaveBeenCalled()
  })

  describe("page scroll", () => {
    function createContext(preservePageScroll: boolean) {
      return {
        config: makeSerpConfig({ preservePageScroll }),
        store: createStore({ loading: false })
      }
    }

    it("is restored after the initial search when preservePageScroll is enabled", async () => {
      await newSearch(createContext(true), { products: { from: 0 } })
      expect(restoreSavedScroll).toHaveBeenCalledTimes(1)
    })

    it("is restored only after the initial search", async () => {
      const context = createContext(true)
      await newSearch(context, { products: { from: 0 } })
      await newSearch(context, { products: { from: 24 } })
      expect(restoreSavedScroll).toHaveBeenCalledTimes(1)
    })

    it("is not restored when preservePageScroll is disabled", async () => {
      await newSearch(createContext(false), { products: { from: 0 } })
      expect(restoreSavedScroll).not.toHaveBeenCalled()
    })

    it("loads the saved product count on the initial search", async () => {
      vi.mocked(loadSavedScroll).mockReturnValue({ url: "", scrollY: 1000, productCount: 72 })
      const context = createContext(true)
      await newSearch(context, { products: { size: 24 } })

      expect(search.mock.calls[0][0].products.size).toBe(72)
      expect(context.store.getState().query.products?.size).toBe(72)
    })

    it("loads the saved product count only on the initial search", async () => {
      vi.mocked(loadSavedScroll).mockReturnValue({ url: "", scrollY: 1000, productCount: 72 })
      const context = createContext(true)
      await newSearch(context, { products: { size: 24 } })
      await newSearch(context, { products: { size: 24 } })

      expect(search.mock.calls[1][0].products.size).toBe(24)
    })

    it("does not load the saved product count when preservePageScroll is disabled", async () => {
      vi.mocked(loadSavedScroll).mockReturnValue({ url: "", scrollY: 1000, productCount: 72 })
      await newSearch(createContext(false), { products: { size: 24 } })

      expect(search.mock.calls[0][0].products.size).toBe(24)
    })
  })

  describe("query base filters", () => {
    const context = {
      config: makeSerpConfig(),
      store: createStore({
        query: {
          products: {
            filter: [
              {
                field: "color",
                value: ["red"]
              }
            ]
          }
        }
      })
    }

    it("should merge base filters with query", async () => {
      const query = {
        products: { from: 0, fields: ["name"], filter: [{ field: "availability", value: ["in_stock"] }] },
        query: "foo"
      } satisfies SearchQuery

      await newSearch(context, query)

      expect(search).toHaveBeenCalledWith(
        {
          products: {
            facets: ["*"],
            fields: ["name"],
            from: 0,
            filter: expect.arrayContaining([
              { field: "color", value: ["red"] },
              { field: "availability", value: ["in_stock"] }
            ])
          },
          query: "foo"
        },
        {
          isKeyword: false,
          redirect: true,
          track: "serp",
          useMemoryCache: false
        }
      )
    })

    it("should not pollute the initial query state by base filters", async () => {
      const query = {
        products: { from: 0, filter: [{ field: "availability", value: ["in_stock"] }] },
        query: "foo"
      } satisfies SearchQuery

      const initialState = context.store.getInitialState()
      await newSearch(context, query)
      expect(context.store.getInitialState()).toEqual(initialState)
    })
  })
})
