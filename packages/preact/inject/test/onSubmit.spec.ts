import { mockNostojs } from "@nosto/nosto-js/testing"
import { describe, expect, it, vi } from "vitest"

import { onSubmit } from "../src/init/autocomplete/events/onSubmit"
import { AutocompleteInjectContext } from "../src/init/injectAutocomplete"

function createMockContext(overrides: Partial<AutocompleteInjectContext> = {}): AutocompleteInjectContext {
  const mockDropdown = {
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
  }

  const mockHistory = {
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
    get: vi.fn(() => ["previous query"])
  }

  const mockStore = {
    updateState: vi.fn(),
    onInit: vi.fn(),
    getState: vi.fn(() => ({
      loading: false,
      query: {},
      response: {},
      initialized: true,
      historyItems: ["previous query"]
    })),
    getInitialState: vi.fn(() => ({
      loading: true,
      query: {},
      response: {},
      initialized: false
    })),
    onChange: vi.fn(),
    clearOnChange: vi.fn()
  }

  return {
    config: {
      pageType: "autocomplete" as const,
      minQueryLength: 2,
      debounceDelay: 100,
      historySize: 5,
      historyEnabled: true,
      memoryCache: false,
      defaultCurrency: "EUR",
      queryModifications: vi.fn((query) => query)
    },
    dropdown: mockDropdown,
    history: mockHistory,
    store: mockStore,
    onNavigateToSearch: vi.fn(),
    input: document.createElement("input") as HTMLInputElement,
    debouncer: vi.fn(),
    query: undefined,
    timeout: 100,
    formCssSelector: "form",
    inputCssSelector: "input",
    dropdownCssSelector: ".dropdown",
    renderAutocomplete: undefined,
    renderHistory: undefined,
    renderSpeechToText: undefined,
    ...overrides
  }
}

describe("onSubmit", () => {

  it("should call recordSearchSubmit with the query value", () => {
    const recordSearchSubmit = vi.fn()
    mockNostojs({
      recordSearchSubmit
    })
    
    const queryValue = "test query"
    const mockContext = createMockContext()

    onSubmit(queryValue, mockContext)

    expect(recordSearchSubmit).toHaveBeenCalledWith(queryValue)
  })

  it("should call both recordSearchSubmit and onNavigateToSearch", () => {
    const recordSearchSubmit = vi.fn()
    mockNostojs({
      recordSearchSubmit
    })
    
    const queryValue = "test query"
    const mockContext = createMockContext()

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
    const mockContext = createMockContext()

    onSubmit(queryValue, mockContext)

    expect(mockContext.dropdown.hide).toHaveBeenCalled()
    expect(mockContext.history.hide).toHaveBeenCalled()
  })

  it("should not proceed if query length is less than minimum", () => {
    const recordSearchSubmit = vi.fn()
    mockNostojs({
      recordSearchSubmit
    })
    
    const shortQuery = "a" // Less than minQueryLength of 2
    const mockContext = createMockContext()

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
    const mockContext = createMockContext()

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
    const mockContext = createMockContext()

    onSubmit(queryValue, mockContext)

    expect(mockContext.onNavigateToSearch).toHaveBeenCalledWith({
      query: queryValue
    })
  })
})
