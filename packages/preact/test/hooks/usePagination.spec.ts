import { describe, expect, it } from "vitest"

import { mockStore } from "../mocks/mocks"

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
const appState = store.getState()

import { usePagination } from "@preact/hooks/usePegination/usePegination"
import { range } from "@preact/hooks/usePegination/utils"

import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

describe("usePagination", () => {
  it("previous for first page is undefined", () => {
    appState.query.products!.from = 0
    appState.response.products!.total = 100
    const { prev, next } = renderHookWithProviders(() => usePagination(), { store }).result.current
    expect(prev).toBeUndefined()
    expect(next).toEqual({ current: false, from: 10, page: 2 })
  })

  it("next for last page is undefined", () => {
    appState.query.products!.from = 90
    appState.response.products!.total = 100
    const { prev, next } = renderHookWithProviders(() => usePagination(), { store }).result.current
    expect(prev).toEqual({ current: false, from: 80, page: 9 })
    expect(next).toBeUndefined()
  })

  it("pages content is valid", () => {
    appState.query.products!.from = 0
    appState.response.products!.total = 30
    const { pages } = renderHookWithProviders(() => usePagination(), { store }).result.current
    expect(pages).toEqual([
      { page: 1, from: 0, current: true },
      { page: 2, from: 10, current: false },
      { page: 3, from: 20, current: false }
    ])
  })
})

describe("range", () => {
  it("should return an array of numbers from start to end - 1", () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4])
  })

  it("should return an empty array if start is equal to end", () => {
    expect(range(5, 5)).toEqual([])
  })

  it("should return an empty array if start is greater than end", () => {
    expect(range(5, 1)).toEqual([])
  })

  it("should return an empty array if start or end is NaN", () => {
    expect(range(NaN, 5)).toEqual([])
    expect(range(5, NaN)).toEqual([])
  })
})
