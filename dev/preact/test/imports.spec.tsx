import {
  createStore,
  NostoAutocompletePageProvider,
  NostoCategoryPageProvider,
  NostoSearchPageProvider,
  State,
  useNostoAppState,
  usePersonalization
} from "@nosto/search-js/preact"
import { renderHook } from "@testing-library/preact"
import { describe, expect, it } from "vitest"

describe("imports", () => {
  it("is able to import preact dependencies", () => {
    expect(useNostoAppState).toBeDefined()
    expect(usePersonalization).toBeDefined()
    expect(createStore).toBeDefined()
    expect(NostoSearchPageProvider).toBeDefined()
    expect(NostoCategoryPageProvider).toBeDefined()
    expect(NostoAutocompletePageProvider).toBeDefined()
  })

  it("runs preact components without conflicts", () => {
    const store = createStore()
    function Wrapper({ children }: { children: Element }) {
      return (
        <NostoSearchPageProvider store={store} config={{}}>
          {children}
        </NostoSearchPageProvider>
      )
    }
    const render = renderHook(() => useNostoAppState(state => state), { wrapper: Wrapper })
    expect<State>(render.result.current)
    expect(render.result.current).toEqual(store.getInitialState())
    store.updateState({
      query: {
        query: "test"
      }
    })
    render.rerender()
    expect(render.result.current.query.query).toEqual("test")
  })
})
