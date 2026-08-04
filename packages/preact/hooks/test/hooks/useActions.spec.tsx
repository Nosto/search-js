import { newSearch } from "@preact/common/actions/newSearch"
import { updateSearch } from "@preact/common/actions/updateSearch"
import { ConfigContext } from "@preact/common/config/configContext"
import { useActions } from "@preact/hooks/useActions"
import { makeSerpConfig } from "@preact/serp/SerpConfig"
import { describe, expect, it, vi } from "vitest"

import { expectStable } from "../mocks/expectStable"
import { mockStore } from "../mocks/mocks"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

vi.mock("@preact/common/actions/newSearch", () => ({ newSearch: vi.fn() }))
vi.mock("@preact/common/actions/updateSearch", () => ({ updateSearch: vi.fn() }))

describe("useActions", () => {
  const store = mockStore({
    loading: false,
    initialized: true,
    query: {},
    response: {}
  })
  const config = makeSerpConfig()
  const Wrapper = ({ children }: { children: Element }) => <ConfigContext value={config}>{children}</ConfigContext>

  function renderUseActions() {
    return renderHookWithProviders(() => useActions(), { store, wrapper: Wrapper })
  }

  it("maintains consistent object values on re-render", () => {
    const render = renderUseActions()
    const firstRender = render.result.current

    render.rerender()
    const secondRender = render.result.current
    expectStable(firstRender, secondRender)
  })

  it("passes the track: 'serp' through to newSearch", () => {
    const { result } = renderUseActions()
    result.current.newSearch({ query: "shoes" }, { track: "serp" })
    expect(newSearch).toHaveBeenCalledWith(expect.anything(), { query: "shoes" }, { track: "serp" })
  })

  it("passes the track: 'serp' through to updateSearch", () => {
    const { result } = renderUseActions()
    result.current.updateSearch({ query: "shoes" }, { track: "serp" })
    expect(updateSearch).toHaveBeenCalledWith(expect.anything(), { query: "shoes" }, { track: "serp" })
  })

  it("passes track: false through to newSearch", () => {
    const { result } = renderUseActions()
    result.current.newSearch({ query: "shoes" }, { track: false })
    expect(newSearch).toHaveBeenCalledWith(expect.anything(), { query: "shoes" }, { track: false })
  })

  it("passes track: false through to updateSearch", () => {
    const { result } = renderUseActions()
    result.current.updateSearch({ query: "shoes" }, { track: false })
    expect(updateSearch).toHaveBeenCalledWith(expect.anything(), { query: "shoes" }, { track: false })
  })
})
