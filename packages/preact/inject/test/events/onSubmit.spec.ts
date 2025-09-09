import { SearchQuery } from "@nosto/nosto-js/client"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { onSubmit } from "../../src/init/autocomplete/events/onSubmit"
import type { AutocompleteInjectContext } from "../../src/init/injectAutocomplete"

const createMockContext = (overrides: Partial<AutocompleteInjectContext> = {}): AutocompleteInjectContext => {
  const baseConfig = {
    pageType: "autocomplete" as const,
    defaultCurrency: "USD",
    queryModifications: (query: SearchQuery) => query,
    memoryCache: false,
    historyEnabled: true,
    historySize: 5,
    debounceDelay: 300,
    minQueryLength: 1
  }

  return {
    // AutocompleteInjectConfig properties
    config: { ...baseConfig, ...overrides.config },
    formCssSelector: "form",
    inputCssSelector: "input",
    dropdownCssSelector: ".dropdown",
    onNavigateToSearch: vi.fn(),
    timeout: 100,
    input: document.createElement("input"),
    dropdown: {
      element: document.createElement("div"),
      hide: vi.fn(),
      show: vi.fn(),
      isOpen: vi.fn(() => false),
      goDown: vi.fn(),
      goUp: vi.fn(),
      highlight: vi.fn(),
      highlightedIndex: vi.fn(() => -1),
      submitHighlightedItem: vi.fn(),
      onHighlightChange: vi.fn()
    },
    history: {
      element: document.createElement("div"),
      hide: vi.fn(),
      show: vi.fn(),
      isOpen: vi.fn(() => false),
      goDown: vi.fn(),
      goUp: vi.fn(),
      highlight: vi.fn(),
      highlightedIndex: vi.fn(() => -1),
      submitHighlightedItem: vi.fn(),
      onHighlightChange: vi.fn(),
      add: vi.fn(),
      get: vi.fn(() => ["test query"])
    },
    store: {
      updateState: vi.fn(),
      getState: vi.fn(() => ({ loading: false, query: {}, response: {}, initialized: true })),
      getInitialState: vi.fn(() => ({ loading: true, query: {}, response: {}, initialized: false })),
      onChange: vi.fn(),
      onInit: vi.fn(),
      clearOnChange: vi.fn()
    },
    debouncer: vi.fn(),
    ...overrides
  }
}

describe("onSubmit", () => {
  const recordSearchSubmit = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    mockNostojs({ recordSearchSubmit })
  })

  it("should call recordSearchSubmit with the query value before onNavigateToSearch", () => {
    const context = createMockContext()
    const value = "test search"

    onSubmit(value, context)

    expect(recordSearchSubmit).toHaveBeenCalledWith(value)
    expect(context.onNavigateToSearch).toHaveBeenCalledWith({ query: value })

    const recordOrder = recordSearchSubmit.mock.invocationCallOrder[0]
    const navigateOrder = (context.onNavigateToSearch as ReturnType<typeof vi.fn>).mock.invocationCallOrder[0]
    expect(recordOrder).toBeLessThan(navigateOrder)
  })

  it("should not call recordSearchSubmit if value length is below minQueryLength", () => {
    const context = createMockContext({
      config: {
        pageType: "autocomplete" as const,
        defaultCurrency: "USD",
        queryModifications: (query: SearchQuery) => query,
        memoryCache: false,
        historyEnabled: true,
        historySize: 5,
        debounceDelay: 300,
        minQueryLength: 3
      }
    })
    const value = ""

    onSubmit(value, context)

    expect(recordSearchSubmit).not.toHaveBeenCalled()
    expect(context.onNavigateToSearch).not.toHaveBeenCalled()
  })

  it("should call all required methods in the correct sequence", () => {
    const context = createMockContext()
    const value = "test search"

    onSubmit(value, context)

    expect(context.dropdown.hide).toHaveBeenCalled()
    expect(context.history.hide).toHaveBeenCalled()
    expect(context.history.add).toHaveBeenCalledWith(value)
    expect(context.store.updateState).toHaveBeenCalledWith({
      historyItems: ["test query"]
    })
    expect(recordSearchSubmit).toHaveBeenCalledWith(value)
    expect(context.onNavigateToSearch).toHaveBeenCalledWith({ query: value })
  })

  it("should handle when onNavigateToSearch is undefined", () => {
    const context = createMockContext({ onNavigateToSearch: undefined })
    const value = "test search"

    expect(() => onSubmit(value, context)).not.toThrow()
    expect(recordSearchSubmit).toHaveBeenCalledWith(value)
  })
})
