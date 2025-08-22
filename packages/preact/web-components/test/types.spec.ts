import { beforeEach, describe, expect, it, vi } from "vitest"
import { NOSTO_EVENTS } from "../src/types"

describe("NostoWebComponents Types", () => {
  it("defines correct event names with nosto:search-js prefix", () => {
    expect(NOSTO_EVENTS.SEARCH).toBe("nosto:search-js/search")
    expect(NOSTO_EVENTS.FILTER_CHANGE).toBe("nosto:search-js/filter-change")
    expect(NOSTO_EVENTS.SORT_CHANGE).toBe("nosto:search-js/sort-change")
    expect(NOSTO_EVENTS.PAGE_CHANGE).toBe("nosto:search-js/page-change")
    expect(NOSTO_EVENTS.RESULTS_UPDATED).toBe("nosto:search-js/results-updated")
    expect(NOSTO_EVENTS.AUTOCOMPLETE_SELECT).toBe("nosto:search-js/autocomplete-select")
  })

  it("has all required event types", () => {
    const eventTypes = Object.keys(NOSTO_EVENTS)
    expect(eventTypes).toContain("SEARCH")
    expect(eventTypes).toContain("FILTER_CHANGE")
    expect(eventTypes).toContain("SORT_CHANGE")
    expect(eventTypes).toContain("PAGE_CHANGE")
    expect(eventTypes).toContain("RESULTS_UPDATED")
    expect(eventTypes).toContain("AUTOCOMPLETE_SELECT")
  })
})