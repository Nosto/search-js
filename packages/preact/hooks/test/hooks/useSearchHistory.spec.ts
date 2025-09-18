import { useSearchHistory } from "@preact/hooks/useSearchHistory"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { mockStore } from "../mocks/mocks"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

describe("useSearchHistory", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  afterEach(() => {
    // Clean up after each test
    localStorage.clear()
  })

  it("returns empty array when no history exists", () => {
    const store = mockStore({})

    const render = renderHookWithProviders(() => useSearchHistory(), { store })
    const { historyItems } = render.result.current

    expect(historyItems).toEqual([])
  })

  it("returns history items from localStorage when not in state", () => {
    // Set up localStorage directly
    const historyData = ["search1", "search2", "search3"]
    localStorage.setItem("nosto:search-js:history", JSON.stringify(historyData))

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
  })

  it("filters out empty strings from localStorage history", () => {
    const historyData = ["search1", "", "search2", null, "search3"]
    localStorage.setItem("nosto:search-js:history", JSON.stringify(historyData))

    const store = mockStore({})

    const render = renderHookWithProviders(() => useSearchHistory(), { store })
    const { historyItems } = render.result.current

    expect(historyItems).toEqual(["search3", "search2", "search1"])
  })

  it("adds new search term to history", () => {
    const existingHistory = ["search1", "search2"]
    localStorage.setItem("nosto:search-js:history", JSON.stringify(existingHistory))

    const store = mockStore({})

    const render = renderHookWithProviders(() => useSearchHistory(), { store })
    const { addToHistory } = render.result.current

    addToHistory("new search")

    const storedHistory = JSON.parse(localStorage.getItem("nosto:search-js:history") || "[]")
    expect(storedHistory).toEqual(["search1", "search2", "new search"])
  })

  it("removes duplicate when adding existing search term", () => {
    const existingHistory = ["search1", "search2", "search3"]
    localStorage.setItem("nosto:search-js:history", JSON.stringify(existingHistory))

    const store = mockStore({})

    const render = renderHookWithProviders(() => useSearchHistory(), { store })
    const { addToHistory } = render.result.current

    addToHistory("search2")

    const storedHistory = JSON.parse(localStorage.getItem("nosto:search-js:history") || "[]")
    expect(storedHistory).toEqual(["search1", "search3", "search2"])
  })

  it("respects history size limit", () => {
    const existingHistory = ["search1", "search2", "search3", "search4", "search5"]
    localStorage.setItem("nosto:search-js:history", JSON.stringify(existingHistory))

    const store = mockStore({})

    const render = renderHookWithProviders(() => useSearchHistory(3), { store })
    const { addToHistory } = render.result.current

    addToHistory("new search")

    const storedHistory = JSON.parse(localStorage.getItem("nosto:search-js:history") || "[]")
    expect(storedHistory).toEqual(["search3", "search4", "search5", "new search"])
  })

  it("does not add empty or whitespace-only strings", () => {
    const store = mockStore({})
    const render = renderHookWithProviders(() => useSearchHistory(), { store })
    const { addToHistory } = render.result.current

    addToHistory("")
    addToHistory("   ")
    addToHistory("\t\n")

    const storedHistory = JSON.parse(localStorage.getItem("nosto:search-js:history") || "[]")
    expect(storedHistory).toEqual([])
  })

  it("trims whitespace from search terms", () => {
    const existingHistory = ["search1"]
    localStorage.setItem("nosto:search-js:history", JSON.stringify(existingHistory))

    const store = mockStore({})

    const render = renderHookWithProviders(() => useSearchHistory(), { store })
    const { addToHistory } = render.result.current

    addToHistory("  new search  ")

    const storedHistory = JSON.parse(localStorage.getItem("nosto:search-js:history") || "[]")
    expect(storedHistory).toEqual(["search1", "new search"])
  })

  it("clears history from localStorage", () => {
    const existingHistory = ["search1", "search2"]
    localStorage.setItem("nosto:search-js:history", JSON.stringify(existingHistory))

    const store = mockStore({})
    const render = renderHookWithProviders(() => useSearchHistory(), { store })
    const { clearHistory } = render.result.current

    clearHistory()

    expect(localStorage.getItem("nosto:search-js:history")).toBeNull()
  })

  it("uses default history size of 10", () => {
    const longHistory = Array.from({ length: 15 }, (_, i) => `search${i}`)
    localStorage.setItem("nosto:search-js:history", JSON.stringify(longHistory))

    const store = mockStore({})

    const render = renderHookWithProviders(() => useSearchHistory(), { store })
    const { addToHistory } = render.result.current

    addToHistory("new search")

    const storedHistory = JSON.parse(localStorage.getItem("nosto:search-js:history") || "[]")
    expect(storedHistory).toEqual([
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
