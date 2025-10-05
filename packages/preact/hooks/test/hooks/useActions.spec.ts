import { useActions } from "@preact/hooks/useActions"
import { describe, it } from "vitest"

import { expectStable } from "../mocks/expectStable"
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

  it("maintains consistent object values on re-render", () => {
    const render = renderHookWithProviders(() => useActions(), { store })
    const firstRender = render.result.current

    // Force re-render without state change
    render.rerender()
    const secondRender = render.result.current

    // Object values should be consistent when state hasn't changed
    expectStable(firstRender, secondRender)
  })
})
