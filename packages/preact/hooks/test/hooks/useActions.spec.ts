import { useActions } from "@preact/hooks/useActions"
import { describe, expect, it } from "vitest"

import { mockActions, mockStore } from "../mocks/mocks"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

describe("useActions", () => {
  const store = mockStore({
    loading: false,
    initialized: true,
    query: {},
    response: {}
  })
  mockActions()

  it("returns actions object with expected methods", () => {
    const render = renderHookWithProviders(() => useActions(), { store })
    const actions = render.result.current

    expect(actions).toHaveProperty("newSearch")
    expect(actions).toHaveProperty("updateSearch")
    expect(actions).toHaveProperty("toggleProductFilter")
    expect(actions).toHaveProperty("replaceFilter")
    expect(typeof actions.newSearch).toBe("function")
    expect(typeof actions.updateSearch).toBe("function")
    expect(typeof actions.toggleProductFilter).toBe("function")
    expect(typeof actions.replaceFilter).toBe("function")
  })

  it("maintains object reference stability on re-render", () => {
    const render = renderHookWithProviders(() => useActions(), { store })
    const firstRender = render.result.current
    
    // Force re-render without state change
    render.rerender()
    const secondRender = render.result.current
    
    // Object reference should be stable when state hasn't changed
    expect(firstRender).toBe(secondRender)
  })
})