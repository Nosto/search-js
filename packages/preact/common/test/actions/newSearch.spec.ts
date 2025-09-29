import { SearchQuery } from "@nosto/nosto-js/client"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { newSearch } from "@preact/common/actions/newSearch"
import { createStore } from "@preact/common/store/store"
import { makeSerpConfig } from "@preact/serp/SerpConfig"
import { beforeEach, describe, expect, it, vi } from "vitest"

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

  describe("filter clearing behavior", () => {
    it("should clear existing filters when newSearch is called with empty filters", async () => {
      // Create a store with existing filters
      const context = {
        config: makeSerpConfig(),
        store: createStore({
          query: {
            products: {
              filter: [
                { field: "brand", value: ["nike"] },
                { field: "color", value: ["red"] }
              ]
            }
          }
        })
      }

      // Perform a new search with no filters (simulating a fresh search)
      const query = { products: { from: 0 }, query: "new search" } satisfies SearchQuery
      await newSearch(context, query)

      // Check that the state query now has no filters
      const currentState = context.store.getState()
      expect(currentState.query.products?.filter).toEqual([])
    })

    it("should allow filters to be explicitly cleared by passing empty filter array", async () => {
      // Create a store with existing filters
      const context = {
        config: makeSerpConfig(),
        store: createStore({
          query: {
            products: {
              filter: [
                { field: "brand", value: ["nike"] },
                { field: "color", value: ["red"] }
              ]
            }
          }
        })
      }

      // Perform a new search with explicitly empty filters
      const query = {
        products: { from: 0, filter: [] },
        query: "new search"
      } satisfies SearchQuery
      await newSearch(context, query)

      // Check that the state query now has no filters
      const currentState = context.store.getState()
      expect(currentState.query.products?.filter).toEqual([])
    })
  })
})
