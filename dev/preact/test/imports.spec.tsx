import {
  // Page Providers
  AutocompletePageProvider,
  CategoryPageProvider,
  createExtendableStore,
  // Store and Context
  createStore,
  defaultState,
  // Components
  SearchInput,
  SearchPageProvider,
  SerpElement,
  State,
  StoreContext,
  // Hooks
  useActions,
  useDecoratedSearchResults,
  useFacet,
  useFacets,
  useNostoAppState,
  usePersonalization,
  useRange,
  useRangeSelector,
  useResponse,
  useSelectedFiltersCount,
  useSizeOptions,
  useSort
} from "@nosto/search-js/preact"
import { renderHook } from "@testing-library/preact"
import { describe, expect, it } from "vitest"

describe("imports", () => {
  it("should be able to import all expected exports", () => {
    // Components
    expect(SearchInput).toBeDefined()
    expect(SerpElement).toBeDefined()

    // Page Providers
    expect(AutocompletePageProvider).toBeDefined()
    expect(CategoryPageProvider).toBeDefined()
    expect(SearchPageProvider).toBeDefined()

    // Hooks
    expect(useActions).toBeDefined()
    expect(useDecoratedSearchResults).toBeDefined()
    expect(useFacet).toBeDefined()
    expect(useFacets).toBeDefined()
    expect(useNostoAppState).toBeDefined()
    expect(usePersonalization).toBeDefined()
    expect(useRange).toBeDefined()
    expect(useRangeSelector).toBeDefined()
    expect(useResponse).toBeDefined()
    expect(useSelectedFiltersCount).toBeDefined()
    expect(useSizeOptions).toBeDefined()
    expect(useSort).toBeDefined()

    // Store and Context
    expect(createStore).toBeDefined()
    expect(defaultState).toBeDefined()
    expect(StoreContext).toBeDefined()
    expect(createExtendableStore).toBeDefined()
  })

  it("runs preact components without conflicts", () => {
    const store = createStore()
    function Wrapper({ children }: { children: Element }) {
      return (
        <SearchPageProvider store={store} config={{}}>
          {children}
        </SearchPageProvider>
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
