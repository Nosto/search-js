import { usePagination } from "@preact/hooks/usePagination"
import { describe, expect, it } from "vitest"

import { mockStore } from "../mocks/mocks"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

describe("usePagination", () => {
  const store = mockStore({
    loading: false,
    initialized: true,
    query: {
      products: {
        from: 0
      }
    },
    response: {
      products: {
        size: 10,
        total: 100,
        hits: []
      }
    }
  })

  function mockUsePagination(from: number, total: number, width = 10) {
    store.updateState({
      query: {
        products: {
          from
        }
      },
      response: {
        products: {
          size: width,
          hits: new Array(total).fill({}),
          total
        }
      }
    })

    return renderHookWithProviders(() => usePagination({ width }), { store }).result.current
  }

  it("previous for first page is undefined", () => {
    const { prev, next } = mockUsePagination(0, 100)
    expect(prev).toBeUndefined()
    expect(next).toEqual({ current: false, from: 10, page: 2 })
  })

  it("next for last page is undefined", () => {
    const { prev, next } = mockUsePagination(90, 100)
    expect(prev).toEqual({ current: false, from: 80, page: 9 })
    expect(next).toBeUndefined()
  })

  it("pages content is valid", () => {
    const { pages } = mockUsePagination(0, 30)
    expect(pages).toEqual([
      { page: 1, from: 0, current: true },
      { page: 2, from: 10, current: false },
      { page: 3, from: 20, current: false }
    ])
  })
})
