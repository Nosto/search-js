import { InfiniteScroll } from "@preact/components/InfiniteScroll/InfiniteScroll"
import { makeSerpConfig } from "@preact/config/pages/serp/config"
import { SearchPageProvider } from "@preact/config/pages/serp/provider"
import { render } from "@testing-library/preact"
import * as utils from "@utils/isBot"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { mockStore, resetStore } from "../../mocks/mocks"

describe("InfiniteScroll", () => {
  vi.spyOn(utils, "isBot").mockReturnValue(true)

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

  beforeEach(() => {
    resetStore(store)
  })

  const InfiniteScrollComponent = () => {
    return (
      <SearchPageProvider config={makeSerpConfig({})} store={store}>
        <InfiniteScroll pageSize={10}>
          <div>Child 1</div>
          <div>Child 2</div>
        </InfiniteScroll>
      </SearchPageProvider>
    )
  }

  it("renders children", () => {
    const result = render(<InfiniteScrollComponent />)

    expect(result.getByText("Child 1")).toBeDefined()
    expect(result.getByText("Child 2")).toBeDefined()
  })

  it("renders load more button when there are more results", () => {
    const result = render(<InfiniteScrollComponent />)

    expect(result.getByText("More results")).toBeDefined()
  })

  it("does not render load more button when there are no more results", () => {
    store.updateState({
      query: {
        products: {
          from: 100
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

    const result = render(<InfiniteScrollComponent />)
    expect(result.queryByText("More results")).toBeNull()
  })
})
