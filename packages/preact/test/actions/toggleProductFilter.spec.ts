import { mockNostojs } from "@nosto/nosto-js/testing"
import { toggleProductFilter } from "@preact/actions/toggleProductFilter"
import { makeSerpConfig } from "@preact/config/pages/serp/config"
import { createStore } from "@preact/store"
import { beforeEach, describe, expect, it, vi } from "vitest"

describe("toggleProductFilter", () => {
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

  const context = {
    config: makeSerpConfig(),
    store: createStore({
      loading: false,
      query: {
        query: "Query",
        products: {
          from: 0,
          size: 32
        }
      }
    })
  }

  it("commits updates to state on filter toggle on", async () => {
    const promise = toggleProductFilter(context, "color", "red", true)
    expect(context.store.getState().loading).toBe(true)
    expect(context.store.getState().response).toEqual({})

    await promise

    expect(context.store.getState().loading).toBe(false)
    expect(context.store.getState().query.query).toBe("Query")
    expect(context.store.getState().query.products?.filter).toEqual([
      {
        field: "color",
        value: ["red"]
      }
    ])
    expect(context.store.getState().response).toEqual({
      products: {
        hits: [{ name: "product 1" }]
      }
    })
  })

  it("commits updates to state on filter toggle off", async () => {
    const context = {
      config: makeSerpConfig(),
      store: createStore({
        loading: false,
        query: {
          products: {
            from: 0,
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

    await toggleProductFilter(context, "color", "red", false)
    expect(context.store.getState().query.products?.filter).toEqual([])
  })

  it("gracefully handles toggle off when filter is not on", async () => {
    await toggleProductFilter(context, "color", "red", false)
    expect(context.store.getState().query.products?.filter).toEqual([])
  })

  it("calls search with merged query", async () => {
    await toggleProductFilter(context, "color", "red", true)
    expect(search).toHaveBeenCalledWith(
      expect.objectContaining({
        products: expect.objectContaining({
          filter: expect.arrayContaining([
            expect.objectContaining({
              field: "color",
              value: ["red"]
            })
          ])
        })
      }),
      expect.objectContaining({})
    )
  })
})
