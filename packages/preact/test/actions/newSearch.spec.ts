import { SearchQuery } from "@nosto/nosto-js/client"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { newSearch } from "@preact/actions/newSearch"
import { makeCategoryConfig } from "@preact/config/pages/category/config"
import { makeSerpConfig } from "@preact/config/pages/serp/config"
import { STORAGE_ENTRY_NAME } from "@preact/search/resultCaching"
import { createStore } from "@preact/store"
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

  describe("caching", () => {
    const query = { products: { from: 0 } }

    it("is applied for search queries", async () => {
      const context = {
        config: makeSerpConfig({
          persistentSearchCache: true
        }),
        store: createStore()
      }
      await newSearch(context, query)
      expect(sessionStorage.getItem(STORAGE_ENTRY_NAME)).not.toBeNull()
    })

    it("is applied for categories queries", async () => {
      const config = makeCategoryConfig({
        persistentSearchCache: true,
        categoryId: () => "123",
        categoryPath: () => "foo"
      })
      const context = {
        config,
        store: createStore()
      }
      await newSearch(context, query)
      expect(sessionStorage.getItem(STORAGE_ENTRY_NAME)).not.toBeNull()
    })

    it("is skipped if persistentSearchCache is not set", async () => {
      const context = {
        config: makeSerpConfig({ persistentSearchCache: false }),
        store: createStore()
      }
      await newSearch(context, query)
      expect(sessionStorage.getItem(STORAGE_ENTRY_NAME)).toBeNull()
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
          track: "serp"
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

  describe("hit decorators", () => {
    const context = {
      config: makeSerpConfig({
        search: {
          hitDecorators: [product => ({ ...product, name: product.name?.toUpperCase() })]
        }
      }),
      store: createStore({})
    }

    it("should decorate results", async () => {
      const query = {
        products: { from: 0 },
        query: "foo"
      } satisfies SearchQuery

      await newSearch(context, query)
      expect(search).toHaveBeenCalled()

      expect(context.store.getState().response).toEqual({
        products: {
          hits: [{ name: "PRODUCT 1" }]
        }
      })
    })
  })
})
