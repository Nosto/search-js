import { useSizeOptions } from "@preact/hooks/useSizeOptions"
import { describe, expect, it } from "vitest"

import { expectStable } from "../mocks/expectStable"
import { mockActions, mockStore } from "../mocks/mocks"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

describe("useSizeOptions", () => {
  const createStoreWithTotal = (total: number) =>
    mockStore({
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
          total,
          hits: []
        }
      }
    })

  const store = createStoreWithTotal(100)
  const actions = mockActions()

  it("returns correct initial values", () => {
    const sizes = [24, 48, 72]
    const serpSize = 5

    const render = renderHookWithProviders(() => useSizeOptions(sizes, serpSize), { store })
    const { from, to, total, size } = render.result.current

    expect(from).toBe(0)
    expect(to).toBe(10)
    expect(total).toBe(100)
    expect(size).toBe(10)
  })

  it("returns correct initial values if no request has been made yet", () => {
    const sizes = [24, 48, 72]
    const serpSize = 5

    const render = renderHookWithProviders(() => useSizeOptions(sizes, serpSize), { store: mockStore({}) })
    const { from, to, total, size } = render.result.current

    expect(from).toBe(0)
    expect(to).toBe(5)
    expect(total).toBe(0)
    expect(size).toBe(5)
  })

  it("handles size change correctly", () => {
    const sizes = [24, 48, 72]
    const serpSize = 5

    const render = renderHookWithProviders(() => useSizeOptions(sizes, serpSize), { store })
    const { handleSizeChange } = render.result.current

    // Call handleSizeChange with a new size
    handleSizeChange(48)

    expect(actions.updateSearch).toHaveBeenCalledWith({
      products: {
        size: 48
      }
    })
  })

  it("returns correct size options", () => {
    const sizes = [24, 48, 72]
    const serpSize = 5

    const render = renderHookWithProviders(() => useSizeOptions(sizes, serpSize), { store })
    const { sizeOptions } = render.result.current

    expect(sizeOptions).toEqual([72, 48, 24])
  })
  it("returns correct size options when there are no more results", () => {
    const sizes = [24, 48, 72]
    const serpSize = 5

    const render = renderHookWithProviders(() => useSizeOptions(sizes, serpSize), { store: createStoreWithTotal(10) })
    const { sizeOptions } = render.result.current

    expect(sizeOptions).toEqual([])
  })

  it("returns only size options smaller than total", () => {
    const sizes = [24, 48, 72]
    const serpSize = 5

    const render = renderHookWithProviders(() => useSizeOptions(sizes, serpSize), { store: createStoreWithTotal(50) })
    const { sizeOptions } = render.result.current

    expect(sizeOptions).toEqual([48, 24])
  })
  it("handles size change correctly with string passed instead", () => {
    const sizes = [24, 48, 72]
    const serpSize = 5

    const render = renderHookWithProviders(() => useSizeOptions(sizes, serpSize), { store })
    const { handleSizeChange } = render.result.current

    // Call handleSizeChange with a new size as forced string
    handleSizeChange("48" as unknown as number)

    expect(actions.updateSearch).toHaveBeenCalledWith({
      products: {
        size: 48
      }
    })
  })

  it("maintains consistent object values on re-render", () => {
    const sizes = [24, 48, 72]
    const serpSize = 5

    const render = renderHookWithProviders(() => useSizeOptions(sizes, serpSize), { store })
    const firstRender = render.result.current

    // Force re-render without state change
    render.rerender()
    const secondRender = render.result.current

    // Object values should be consistent when state hasn't changed
    expectStable(firstRender, secondRender)
  })
})
