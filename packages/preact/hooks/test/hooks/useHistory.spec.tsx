import { makeAutocompleteConfig } from "@preact/autocomplete/AutocompleteConfig"
import { ConfigContext } from "@preact/common/config/configContext"
import { historyKey, useHistory } from "@preact/hooks/useHistory"
import { describe, expect, it, vi } from "vitest"

import { mockLocalStorage, mockStore } from "../mocks/mocks"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

const localStorage = mockLocalStorage()

describe("useHistory", () => {
  const renderUseHistory = (historySize = 5) => {
    const config = makeAutocompleteConfig({ historySize })
    const store = mockStore({ historyItems: [] })

    const Wrapper = ({ children }: { children: Element }) => <ConfigContext value={config}>{children}</ConfigContext>

    return renderHookWithProviders(() => useHistory(), { store, wrapper: Wrapper })
  }

  describe("addQuery", () => {
    it("should add a new query to empty history", () => {
      const { result } = renderUseHistory()

      result.current.addQuery("test query")

      expect(localStorage.setItem).toHaveBeenCalledWith(historyKey, JSON.stringify(["test query"]))
    })

    it("should add a new query to existing history", () => {
      localStorage.setItem(historyKey, JSON.stringify(["existing query"]))
      const { result } = renderUseHistory()

      result.current.addQuery("new query")

      expect(localStorage.setItem).toHaveBeenCalledWith(historyKey, JSON.stringify(["existing query", "new query"]))
    })

    it("should remove duplicate query and add it to the end", () => {
      localStorage.setItem(historyKey, JSON.stringify(["query1", "query2", "query3"]))
      const { result } = renderUseHistory()

      result.current.addQuery("query2")

      expect(localStorage.setItem).toHaveBeenCalledWith(historyKey, JSON.stringify(["query1", "query3", "query2"]))
    })

    it("should update store state with reversed history items", () => {
      localStorage.setItem(historyKey, JSON.stringify(["query1", "query2"]))
      const store = mockStore({ historyItems: [] })
      vi.spyOn(store, "updateState")
      const config = makeAutocompleteConfig({ historySize: 5 })

      const Wrapper = ({ children }: { children: Element }) => <ConfigContext value={config}>{children}</ConfigContext>

      const { result } = renderHookWithProviders(() => useHistory(), { store, wrapper: Wrapper })

      result.current.addQuery("new query")

      // Verify store was updated with reversed array
      expect(store.updateState).toHaveBeenCalledWith({
        historyItems: ["new query", "query2", "query1"]
      })
    })
  })

  describe("getSaved", () => {
    it("should return empty array when no history exists", () => {
      const { result } = renderUseHistory()

      const saved = result.current.getSaved()

      expect(saved).toEqual([])
    })

    it("should return reversed history items", () => {
      localStorage.setItem(historyKey, JSON.stringify(["query1", "query2", "query3"]))
      const { result } = renderUseHistory()

      const saved = result.current.getSaved()

      expect(saved).toEqual(["query3", "query2", "query1"])
    })

    it("should filter out empty strings and falsy values", () => {
      localStorage.setItem(historyKey, JSON.stringify(["query1", "", "query2", null, "query3", undefined]))
      const { result } = renderUseHistory()

      const saved = result.current.getSaved()

      expect(saved).toEqual(["query3", "query2", "query1"])
    })
  })

  it("should keep the latest N queries in storage", () => {
    localStorage.setItem(historyKey, JSON.stringify(["old1", "old2"]))
    const { result } = renderUseHistory(3)

    result.current.addQuery("new1")
    expect(localStorage.setItem).toHaveBeenCalledWith(historyKey, JSON.stringify(["old1", "old2", "new1"]))

    result.current.addQuery("new2")
    expect(localStorage.setItem).toHaveBeenCalledWith(historyKey, JSON.stringify(["old2", "new1", "new2"]))

    result.current.addQuery("new3")
    expect(localStorage.setItem).toHaveBeenCalledWith(historyKey, JSON.stringify(["new1", "new2", "new3"]))
  })

  it("should keep 1 query with history size of 1", () => {
    localStorage.setItem(historyKey, JSON.stringify(["old1", "old2"]))
    const { result } = renderUseHistory(1)

    result.current.addQuery("new1")
    expect(localStorage.setItem).toHaveBeenCalledWith(historyKey, JSON.stringify(["new1"]))
  })

  it("should keep no queries with history size of 1", () => {
    localStorage.setItem(historyKey, JSON.stringify(["old1", "old2"]))
    const { result } = renderUseHistory(0)

    result.current.addQuery("new1")
    expect(localStorage.setItem).toHaveBeenCalledWith(historyKey, JSON.stringify([]))
  })
})
