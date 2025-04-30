import { mockNostojs } from "@nosto/nosto-js/testing"
import { InfiniteScroll } from "@preact/components/InfiniteScroll/InfiniteScroll"
import { makeSerpConfig, PublicSerpConfig } from "@preact/config/pages/serp/config"
import { SearchPageProvider } from "@preact/config/pages/serp/provider"
import { render } from "@testing-library/preact"
import * as utils from "@utils/isBot"
import { pick } from "@utils/pick"
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

  const InfiniteScrollComponent = (
    { config, size }: { config?: PublicSerpConfig; size?: number } = { config: {}, size: 10 }
  ) => {
    return (
      <SearchPageProvider config={makeSerpConfig(config)} store={store}>
        <InfiniteScroll pageSize={size}>
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

  it("uses persistentSearchCache when enabled", () => {
    store.updateState({
      query: {
        products: {
          from: 0,
          size: 1
        }
      },
      response: {
        products: {
          total: 2,
          size: 1,
          hits: [{ productId: "1", name: "Previous Product" }]
        }
      }
    })

    const result = render(<InfiniteScrollComponent config={{ persistentSearchCache: true }} size={1} />)

    expect(result.getByText("More results")).toBeDefined()

    mockNostojs({
      search: vi.fn().mockResolvedValue({
        products: {
          total: 2,
          from: 1,
          size: 1,
          hits: [{ productId: "2", name: "New Product" }]
        }
      })
    })

    result.getByText("More results").click()

    store.onChange(
      state => pick(state, "loading", "response"),
      ({ loading, response }) => {
        if (!loading) {
          expect(response).toEqual({
            total: 2,
            from: 1,
            size: 1,
            hits: [{ productId: "2", name: "New Product" }]
          })
        }
      }
    )
  })
})
