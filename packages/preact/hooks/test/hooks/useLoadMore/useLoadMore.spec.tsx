import { ConfigContext } from "@preact/common/config/configContext"
import { useLoadMore } from "@preact/hooks/useLoadMore/useLoadMore"
import { makeSerpConfig } from "@preact/serp/SerpConfig"
import { describe, expect, it } from "vitest"

import { mockActions, mockStore } from "../../mocks/mocks"
import { renderHookWithProviders } from "../../mocks/renderHookWithProviders"

describe("useLoadMore", () => {
  const store = mockStore({
    loading: false,
    initialized: true,
    query: {
      products: {
        from: 0,
        size: 24
      }
    },
    response: {
      products: {
        size: 24,
        total: 100,
        hits: []
      }
    }
  })
  mockActions()

  it("returns a loadMore function", () => {
    const pageSize = 24
    const { loadMore } = renderHookWithProviders(() => useLoadMore(pageSize), {
      store,
      wrapper: ({ children }) => <ConfigContext value={makeSerpConfig()}>{children}</ConfigContext>
    }).result.current

    expect(loadMore).toBeInstanceOf(Function)
  })
})
