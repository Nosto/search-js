import { mockNostojs } from "@nosto/nosto-js/testing"
import { describe, expect, it, vi } from "vitest"

import { onSubmit } from "../src/init/autocomplete/events/onSubmit"

describe("onSubmit", () => {
  let mockContext: {
    config: { minQueryLength: number }
    dropdown: { hide: ReturnType<typeof vi.fn> }
    history: {
      hide: ReturnType<typeof vi.fn>
      add: ReturnType<typeof vi.fn>
      get: ReturnType<typeof vi.fn>
    }
    store: { updateState: ReturnType<typeof vi.fn> }
    onNavigateToSearch: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockContext = {
      config: {
        minQueryLength: 2
      },
      dropdown: {
        hide: vi.fn()
      },
      history: {
        hide: vi.fn(),
        add: vi.fn(),
        get: vi.fn(() => ["previous query"])
      },
      store: {
        updateState: vi.fn()
      },
      onNavigateToSearch: vi.fn()
    }
  })

  it("should call recordSearchSubmit with the query value", () => {
    const recordSearchSubmit = vi.fn()
    mockNostojs({
      recordSearchSubmit
    })

    const queryValue = "test query"

    // @ts-expect-error - Mock context for testing purposes
    onSubmit(queryValue, mockContext)

    expect(recordSearchSubmit).toHaveBeenCalledWith(queryValue)
  })

  it("should call both recordSearchSubmit and onNavigateToSearch", () => {
    const recordSearchSubmit = vi.fn()
    mockNostojs({
      recordSearchSubmit
    })

    const queryValue = "test query"

    // @ts-expect-error - Mock context for testing purposes
    onSubmit(queryValue, mockContext)

    expect(recordSearchSubmit).toHaveBeenCalledWith(queryValue)
    expect(mockContext.onNavigateToSearch).toHaveBeenCalledWith({
      query: queryValue
    })
  })

  it("should hide dropdown and history", () => {
    const recordSearchSubmit = vi.fn()
    mockNostojs({
      recordSearchSubmit
    })

    const queryValue = "test query"

    // @ts-expect-error - Mock context for testing purposes
    onSubmit(queryValue, mockContext)

    expect(mockContext.dropdown.hide).toHaveBeenCalled()
    expect(mockContext.history.hide).toHaveBeenCalled()
  })

  it("should not proceed if query length is less than minimum", () => {
    const recordSearchSubmit = vi.fn()
    mockNostojs({
      recordSearchSubmit
    })

    const shortQuery = "a"

    // @ts-expect-error - Mock context for testing purposes
    onSubmit(shortQuery, mockContext)

    expect(mockContext.history.add).not.toHaveBeenCalled()
    expect(mockContext.store.updateState).not.toHaveBeenCalled()
    expect(recordSearchSubmit).not.toHaveBeenCalled()
    expect(mockContext.onNavigateToSearch).not.toHaveBeenCalled()
  })

  it("should add to history and update store state", () => {
    const recordSearchSubmit = vi.fn()
    mockNostojs({
      recordSearchSubmit
    })

    const queryValue = "test query"

    // @ts-expect-error - Mock context for testing purposes
    onSubmit(queryValue, mockContext)

    expect(mockContext.history.add).toHaveBeenCalledWith(queryValue)
    expect(mockContext.store.updateState).toHaveBeenCalledWith({
      historyItems: ["previous query"]
    })
  })

  it("should call onNavigateToSearch with correct query", () => {
    const recordSearchSubmit = vi.fn()
    mockNostojs({
      recordSearchSubmit
    })

    const queryValue = "test query"

    // @ts-expect-error - Mock context for testing purposes
    onSubmit(queryValue, mockContext)

    expect(mockContext.onNavigateToSearch).toHaveBeenCalledWith({
      query: queryValue
    })
  })
})
