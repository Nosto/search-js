import { mockNostojs } from "@nosto/nosto-js/testing"
import { replaceFilter } from "@preact/common/actions/replaceFilter"
import { createStore } from "@preact/common/store/store"
import { makeSerpConfig } from "@preact/serp/SerpConfig"
import { beforeEach, describe, expect, it, vi } from "vitest"

describe("replaceFilter", () => {
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

  it("commits updates to state on filter add", async () => {
    const promise = replaceFilter(context, "color", "red")
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

  it("commits updates to state on filter replace", async () => {
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

    await replaceFilter(context, "color", "blue")
    expect(context.store.getState().query.products?.filter).toEqual([
      {
        field: "color",
        value: ["blue"]
      }
    ])
  })

  it("calls search with merged query", async () => {
    await replaceFilter(context, "color", "red")
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
