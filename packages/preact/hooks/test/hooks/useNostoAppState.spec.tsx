import { State } from "@preact/common/store/store"
import { useNostoAppState } from "@preact/hooks/useNostoAppState"
import { describe, expect, it, vi } from "vitest"

import { mockStore } from "../mocks/mocks"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

describe("useNostoAppState", () => {
  const store = mockStore({
    loading: false,
    initialized: true,
    response: {
      query: "I'm a query",
      products: {
        size: 10,
        total: 100,
        hits: []
      }
    }
  })

  it("returns the entire state without selector", () => {
    const render = renderHookWithProviders(() => useNostoAppState(), { store })

    expect<State>(render.result.current)
    expect(render.result.current).toEqual(store.getInitialState())
  })

  it("returns the entire state when selected", () => {
    const render = renderHookWithProviders(() => useNostoAppState(state => state), { store })

    expect<State>(render.result.current)
    expect(render.result.current).toEqual(store.getInitialState())
  })

  it("returns response from state when selected", () => {
    const render = renderHookWithProviders(() => useNostoAppState(state => state.response), { store })

    expect(render.result.current).toEqual(store.getState().response)
  })

  it("does not modify the store state", () => {
    renderHookWithProviders(() => useNostoAppState(state => state.response), { store })
    expect(store.getState()).toEqual(store.getInitialState())
  })

  it("updates the selector when state changes", () => {
    const render = renderHookWithProviders(() => useNostoAppState(state => state.loading), { store })

    expect(render.result.current).toEqual(false)
    store.updateState({
      loading: true
    })
    render.rerender()
    expect(render.result.current).toEqual(true)
  })

  it("registers onChange on mount", () => {
    store.onChange = vi.fn()
    store.clearOnChange = vi.fn()

    renderHookWithProviders(() => useNostoAppState(state => state.loading), { store })

    expect(store.onChange).toHaveBeenCalled()
    expect(store.clearOnChange).not.toHaveBeenCalled()
  })

  it("clears out the store registration on unmount", () => {
    const render = renderHookWithProviders(() => useNostoAppState(state => state.loading), { store })

    store.clearOnChange = vi.fn()
    render.unmount()

    expect(store.clearOnChange).toHaveBeenCalled()
  })
})
