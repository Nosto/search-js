import { useSearchHistory } from "@preact/hooks/useSearchHistory"
import * as storage from "@utils/storage"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { mockStore } from "../mocks/mocks"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

// Mock the storage module
vi.mock("@utils/storage", () => ({
  getLocalStorageItem: vi.fn(),
  setLocalStorageItem: vi.fn(),
  removeLocalStorageItem: vi.fn()
}))

describe("useSearchHistory", () => {
  const mockGetLocalStorageItem = vi.mocked(storage.getLocalStorageItem)
  const mockSetLocalStorageItem = vi.mocked(storage.setLocalStorageItem)
  const mockRemoveLocalStorageItem = vi.mocked(storage.removeLocalStorageItem)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("returns empty array when no history exists", () => {
    mockGetLocalStorageItem.mockReturnValue(null)
    const store = mockStore({})

    const render = renderHookWithProviders(() => useSearchHistory(), { store })
    const { historyItems } = render.result.current

    expect(historyItems).toEqual([])
    expect(mockGetLocalStorageItem).toHaveBeenCalledWith("nosto:search-js:history")
  })

  it("returns history items from localStorage when not in state", () => {
    const historyData = ["search1", "search2", "search3"]
    mockGetLocalStorageItem.mockReturnValue(historyData)
    const store = mockStore({})

    const render = renderHookWithProviders(() => useSearchHistory(), { store })
    const { historyItems } = render.result.current

    expect(historyItems).toEqual(["search3", "search2", "search1"]) // reversed
  })

  it("returns history items from state when available", () => {
    const stateHistoryItems = ["state1", "state2"]
    const store = mockStore({
      historyItems: stateHistoryItems
    })

    const render = renderHookWithProviders(() => useSearchHistory(), { store })
    const { historyItems } = render.result.current

    expect(historyItems).toEqual(stateHistoryItems)
    expect(mockGetLocalStorageItem).not.toHaveBeenCalled()
  })

  it("filters out empty strings from localStorage history", () => {
    const historyData = ["search1", "", "search2", null, "search3"]
    mockGetLocalStorageItem.mockReturnValue(historyData)
    const store = mockStore({})

    const render = renderHookWithProviders(() => useSearchHistory(), { store })
    const { historyItems } = render.result.current

    expect(historyItems).toEqual(["search3", "search2", "search1"])
  })

  it("adds new search term to history", () => {
    const existingHistory = ["search1", "search2"]
    mockGetLocalStorageItem.mockReturnValue(existingHistory)
    const store = mockStore({})

    const render = renderHookWithProviders(() => useSearchHistory(), { store })
    const { addToHistory } = render.result.current

    addToHistory("new search")

    expect(mockSetLocalStorageItem).toHaveBeenCalledWith("nosto:search-js:history", [
      "search1",
      "search2",
      "new search"
    ])
  })

  it("removes duplicate when adding existing search term", () => {
    const existingHistory = ["search1", "search2", "search3"]
    mockGetLocalStorageItem.mockReturnValue(existingHistory)
    const store = mockStore({})

    const render = renderHookWithProviders(() => useSearchHistory(), { store })
    const { addToHistory } = render.result.current

    addToHistory("search2")

    expect(mockSetLocalStorageItem).toHaveBeenCalledWith("nosto:search-js:history", ["search1", "search3", "search2"])
  })

  it("respects history size limit", () => {
    const existingHistory = ["search1", "search2", "search3", "search4", "search5"]
    mockGetLocalStorageItem.mockReturnValue(existingHistory)
    const store = mockStore({})

    const render = renderHookWithProviders(() => useSearchHistory(3), { store })
    const { addToHistory } = render.result.current

    addToHistory("new search")

    expect(mockSetLocalStorageItem).toHaveBeenCalledWith("nosto:search-js:history", [
      "search3",
      "search4",
      "search5",
      "new search"
    ])
  })

  it("does not add empty or whitespace-only strings", () => {
    const store = mockStore({})
    const render = renderHookWithProviders(() => useSearchHistory(), { store })
    const { addToHistory } = render.result.current

    addToHistory("")
    addToHistory("   ")
    addToHistory("\t\n")

    expect(mockSetLocalStorageItem).not.toHaveBeenCalled()
  })

  it("trims whitespace from search terms", () => {
    const existingHistory = ["search1"]
    mockGetLocalStorageItem.mockReturnValue(existingHistory)
    const store = mockStore({})

    const render = renderHookWithProviders(() => useSearchHistory(), { store })
    const { addToHistory } = render.result.current

    addToHistory("  new search  ")

    expect(mockSetLocalStorageItem).toHaveBeenCalledWith("nosto:search-js:history", ["search1", "new search"])
  })

  it("gets history from localStorage via getHistory method", () => {
    const historyData = ["search1", "search2", "search3"]
    mockGetLocalStorageItem.mockReturnValue(historyData)
    const store = mockStore({})

    const render = renderHookWithProviders(() => useSearchHistory(), { store })
    const { getHistory } = render.result.current

    const result = getHistory()

    expect(result).toEqual(["search3", "search2", "search1"]) // reversed
    expect(mockGetLocalStorageItem).toHaveBeenCalledWith("nosto:search-js:history")
  })

  it("clears history from localStorage", () => {
    const store = mockStore({})
    const render = renderHookWithProviders(() => useSearchHistory(), { store })
    const { clearHistory } = render.result.current

    clearHistory()

    expect(mockRemoveLocalStorageItem).toHaveBeenCalledWith("nosto:search-js:history")
  })

  it("uses default history size of 10", () => {
    const longHistory = Array.from({ length: 15 }, (_, i) => `search${i}`)
    mockGetLocalStorageItem.mockReturnValue(longHistory)
    const store = mockStore({})

    const render = renderHookWithProviders(() => useSearchHistory(), { store })
    const { addToHistory } = render.result.current

    addToHistory("new search")

    expect(mockSetLocalStorageItem).toHaveBeenCalledWith("nosto:search-js:history", [
      "search5",
      "search6",
      "search7",
      "search8",
      "search9",
      "search10",
      "search11",
      "search12",
      "search13",
      "search14",
      "new search"
    ])
  })
})
