import { mockNostojs } from "@nosto/nosto-js/testing"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { onSubmit } from "../src/init/autocomplete/events/onSubmit"
import { AutocompleteInjectContext } from "../src/init/injectAutocomplete"

describe("onSubmit", () => {
  let mockApi: {
    recordSearchSubmit: ReturnType<typeof vi.fn>
  }
  let mockContext: Partial<AutocompleteInjectContext>

  beforeEach(() => {
    mockApi = {
      recordSearchSubmit: vi.fn()
    }

    mockNostojs(mockApi)

    mockContext = {
      config: {
        minQueryLength: 2
      } as unknown as Partial<AutocompleteInjectContext>["config"],
      dropdown: {
        hide: vi.fn()
      } as unknown as Partial<AutocompleteInjectContext>["dropdown"],
      history: {
        hide: vi.fn(),
        add: vi.fn(),
        get: vi.fn(() => ["previous query"])
      } as unknown as Partial<AutocompleteInjectContext>["history"],
      store: {
        updateState: vi.fn()
      } as unknown as Partial<AutocompleteInjectContext>["store"],
      onNavigateToSearch: vi.fn()
    }
  })

  it("should call recordSearchSubmit with the query value", () => {
    const queryValue = "test query"

    onSubmit(queryValue, mockContext as AutocompleteInjectContext)

    expect(mockApi.recordSearchSubmit).toHaveBeenCalledWith(queryValue)
  })

  it("should call both recordSearchSubmit and onNavigateToSearch", () => {
    const queryValue = "test query"

    onSubmit(queryValue, mockContext as AutocompleteInjectContext)

    expect(mockApi.recordSearchSubmit).toHaveBeenCalledWith(queryValue)
    expect(mockContext.onNavigateToSearch).toHaveBeenCalledWith({
      query: queryValue
    })
  })

  it("should hide dropdown and history", () => {
    const queryValue = "test query"

    onSubmit(queryValue, mockContext as AutocompleteInjectContext)

    expect(mockContext.dropdown!.hide).toHaveBeenCalled()
    expect(mockContext.history!.hide).toHaveBeenCalled()
  })

  it("should not proceed if query length is less than minimum", () => {
    const shortQuery = "a" // Less than minQueryLength of 2

    onSubmit(shortQuery, mockContext as AutocompleteInjectContext)

    expect(mockContext.history!.add).not.toHaveBeenCalled()
    expect(mockContext.store!.updateState).not.toHaveBeenCalled()
    expect(mockApi.recordSearchSubmit).not.toHaveBeenCalled()
    expect(mockContext.onNavigateToSearch).not.toHaveBeenCalled()
  })

  it("should add to history and update store state", () => {
    const queryValue = "test query"

    onSubmit(queryValue, mockContext as AutocompleteInjectContext)

    expect(mockContext.history!.add).toHaveBeenCalledWith(queryValue)
    expect(mockContext.store!.updateState).toHaveBeenCalledWith({
      historyItems: ["previous query"]
    })
  })

  it("should call onNavigateToSearch with correct query", () => {
    const queryValue = "test query"

    onSubmit(queryValue, mockContext as AutocompleteInjectContext)

    expect(mockContext.onNavigateToSearch).toHaveBeenCalledWith({
      query: queryValue
    })
  })
})
