import { ConfigContext } from "@preact/config/configContext"
import { makeSerpConfig } from "@preact/config/pages/serp/config"
import { useLoadMore } from "@preact/hooks/useLoadMore"
import { describe, expect, it } from "vitest"

import { mockStore } from "../mocks/mocks"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

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

  it("returns a loadMore function", () => {
    const pageSize = 24
    const { result } = renderHookWithProviders(() => useLoadMore(pageSize), {
      store,
      wrapper: ({ children }) => <ConfigContext value={makeSerpConfig()}>{children}</ConfigContext>
    })
    expect(result.current.loadMore).toBeInstanceOf(Function)
  })
})
