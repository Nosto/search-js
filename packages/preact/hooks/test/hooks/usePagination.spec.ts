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

  it("previous and first for first page is undefined", () => {
    const { prev, first, next } = mockUsePagination(0, 100)
    expect(prev).toBeUndefined()
    expect(first).toBeUndefined()
    expect(next).toEqual({ current: false, from: 10, page: 2 })
  })

  it("next and last for last page is undefined", () => {
    const { prev, next, last } = mockUsePagination(90, 100)
    expect(prev).toEqual({ current: false, from: 80, page: 9 })
    expect(next).toBeUndefined()
    expect(last).toBeUndefined()
  })

  it("pages content is valid", () => {
    const { pages } = mockUsePagination(0, 30)
    expect(pages).toEqual([
      { page: 1, from: 0, current: true },
      { page: 2, from: 10, current: false },
      { page: 3, from: 20, current: false }
    ])
  })

  it("first is covered in pages array", () => {
    const { first, pages, last } = mockUsePagination(50, 100, 10)
    expect(first).toBeUndefined()
    expect(pages).toEqual([
      { page: 1, from: 0, current: false },
      { page: 2, from: 10, current: false },
      { page: 3, from: 20, current: false },
      { page: 4, from: 30, current: false },
      { page: 5, from: 40, current: false },
      { page: 6, from: 50, current: true }, // current
      { page: 7, from: 60, current: false },
      { page: 8, from: 70, current: false },
      { page: 9, from: 80, current: false },
      { page: 10, from: 90, current: false }
    ])
    expect(last).toBeUndefined()
  })

  it("first is detached", () => {
    const { first, pages, last } = mockUsePagination(60, 100, 10)
    expect(first).toEqual({ current: false, from: 0, page: 1 })
    expect(pages).toEqual([
      { page: 3, from: 20, current: false },
      { page: 4, from: 30, current: false },
      { page: 5, from: 40, current: false },
      { page: 6, from: 50, current: false },
      { page: 7, from: 60, current: true }, // current
      { page: 8, from: 70, current: false },
      { page: 9, from: 80, current: false },
      { page: 10, from: 90, current: false }
    ])
    expect(last).toBeUndefined()
  })

  it("last is covered in pages array", () => {
    const { first, pages, last } = mockUsePagination(40, 100, 10)
    expect(first).toBeUndefined()
    expect(pages).toEqual([
      { page: 1, from: 0, current: false },
      { page: 2, from: 10, current: false },
      { page: 3, from: 20, current: false },
      { page: 4, from: 30, current: false },
      { page: 5, from: 40, current: true }, // current
      { page: 6, from: 50, current: false },
      { page: 7, from: 60, current: false },
      { page: 8, from: 70, current: false },
      { page: 9, from: 80, current: false },
      { page: 10, from: 90, current: false }
    ])
    expect(last).toBeUndefined()
  })

  it("last is detached", () => {
    const { first, pages, last } = mockUsePagination(30, 100, 10)
    expect(first).toBeUndefined()
    expect(pages).toEqual([
      { page: 1, from: 0, current: false },
      { page: 2, from: 10, current: false },
      { page: 3, from: 20, current: false },
      { page: 4, from: 30, current: true }, // current
      { page: 5, from: 40, current: false },
      { page: 6, from: 50, current: false },
      { page: 7, from: 60, current: false },
      { page: 8, from: 70, current: false }
    ])
    expect(last).toEqual({ current: false, from: 90, page: 10 })
  })

  it("maintains consistent object values on re-render", () => {
    const render = renderHookWithProviders(() => usePagination(), { store })
    const firstRender = render.result.current
    
    // Force re-render without state change
    render.rerender()
    const secondRender = render.result.current
    
    // Object values should be consistent when state hasn't changed
    expect(firstRender).toStrictEqual(secondRender)
  })
})
