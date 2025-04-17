import { mockNostojs } from "@nosto/nosto-js/testing"
import { updateSearch } from "@preact/actions/updateSearch"
import { makeSerpConfig } from "@preact/config/pages/serp/config"
import { createStore } from "@preact/store"
import { beforeEach, describe, expect, it, vi } from "vitest"

describe("updateSearch", () => {
  const search = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    search.mockResolvedValue({ products: { hits: [{ name: "product 1" }], total: 2 } })

    mockNostojs({
      search
    })

    sessionStorage.clear()
    vi.spyOn(console, "info").mockImplementation(() => {})
  })

  const context = {
    config: makeSerpConfig(),
    store: createStore({
      loading: false,
      query: {
        query: "Old query",
        products: {
          from: 0,
          size: 32
        }
      }
    })
  }

  it("commits updates to state", async () => {
    const query = { query: "New query" }
    const promise = updateSearch({ context, query })
    expect(context.store.getState().loading).toBe(true)
    expect(context.store.getState().response).toEqual({})

    await promise

    expect(context.store.getState().loading).toBe(false)
    expect(context.store.getState().query.query).toBe("New query")
    expect(context.store.getState().query.products).toEqual({
      from: 0,
      size: 32
    })
    expect(context.store.getState().response).toEqual({
      products: {
        hits: [{ name: "product 1" }],
        total: 2
      }
    })
  })

  it("calls search with merged query", async () => {
    const query = { query: "New query" }
    await updateSearch({ context, query })
    expect(search).toHaveBeenCalledWith(
      expect.objectContaining({
        query: "New query",
        products: expect.objectContaining({
          from: 0,
          size: 32
        })
      }),
      expect.objectContaining({})
    )
  })

  it("merges product hits using the search result transformer", async () => {
    const query = { query: "New query" }
    await updateSearch({ context, query })

    await updateSearch({
      context,
      query,
      transformer: result => ({
        ...result,
        products: {
          ...result.products,
          hits: [{ productId: "product 1" }, { productId: "product 1" }],
          total: 2
        }
      })
    })
  })
})
