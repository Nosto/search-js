import { useSizeOptions } from "@preact/hooks/useSizeOptions"
import { describe, expect, it } from "vitest"

import { mockActions, mockStore } from "../mocks/mocks"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

describe("useSizeOptions", () => {
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
    const serpSize = 100

    const render = renderHookWithProviders(() => useSizeOptions(sizes, serpSize), { store })
    const { sizeOptions } = render.result.current

    expect(sizeOptions).toEqual([])
  })
  it("handles size change correctly with string passed instead", () => {
    const sizes = [24, 48, 72]
    const serpSize = 5

    const render = renderHookWithProviders(() => useSizeOptions(sizes, serpSize), { store })
    const { handleSizeChange } = render.result.current

    // Call handleSizeChange with a new size
    handleSizeChange("48")

    expect(actions.updateSearch).toHaveBeenCalledWith({
      products: {
        size: 48
      }
    })
  })
})
