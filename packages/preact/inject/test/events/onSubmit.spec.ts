import { mockNostojs } from "@nosto/nosto-js/testing"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { onSubmit } from "../../src/init/autocomplete/events/onSubmit"
import type { AutocompleteInjectContext } from "../../src/init/injectAutocomplete"

// Create a minimal mock that satisfies the type requirements
const createMockContext = (overrides = {}) =>
  ({
    config: { minQueryLength: 1 },
    dropdown: { hide: vi.fn() },
    history: {
      hide: vi.fn(),
      add: vi.fn(),
      get: vi.fn(() => ["test query"])
    },
    store: { updateState: vi.fn() },
    onNavigateToSearch: vi.fn(),
    formCssSelector: "form",
    inputCssSelector: "input",
    dropdownCssSelector: ".dropdown",
    ...overrides
  }) as unknown as AutocompleteInjectContext

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

    // Verify the order: recordSearchSubmit should be called before onNavigateToSearch
    const recordOrder = recordSearchSubmit.mock.invocationCallOrder[0]
    const navigateOrder = (context.onNavigateToSearch as ReturnType<typeof vi.fn>).mock.invocationCallOrder[0]
    expect(recordOrder).toBeLessThan(navigateOrder)
  })

  it("should not call recordSearchSubmit if value length is below minQueryLength", () => {
    const context = createMockContext({ config: { minQueryLength: 3 } })
    const value = ""

    onSubmit(value, context)

    expect(recordSearchSubmit).not.toHaveBeenCalled()
    expect(context.onNavigateToSearch).not.toHaveBeenCalled()
  })

  it("should call all required methods in the correct sequence", () => {
    const context = createMockContext()
    const value = "test search"

    onSubmit(value, context)

    // Verify all methods are called
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
