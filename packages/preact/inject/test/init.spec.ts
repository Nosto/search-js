import { mockNostojs } from "@nosto/nosto-js/testing"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { init } from "../src/init"
import * as injectAutocomplete from "../src/init/injectAutocomplete"
import * as injectCategory from "../src/init/injectCategory"
import * as injectSerp from "../src/init/injectSerp"

const mockConfig = {
  defaultCurrency: "USD",
  search: {}
}

describe("init", () => {
  beforeEach(() => {
    mockNostojs()
    vi.spyOn(injectAutocomplete, "injectAutocomplete").mockImplementation(vi.fn())
    vi.spyOn(injectCategory, "injectCategory").mockImplementation(vi.fn())
    vi.spyOn(injectSerp, "injectSerp").mockImplementation(vi.fn())
  })

  it("should pass query to autocomplete store", async () => {
    const query = { query: "test autocomplete" }

    const result = await init({
      autocomplete: {
        config: mockConfig,
        query,
        formCssSelector: "form",
        inputCssSelector: "input",
        dropdownCssSelector: ".dropdown"
      }
    })

    expect(result.autocomplete.store.getState().query).toEqual(query)
  })

  it("should pass query to category store", async () => {
    const query = { query: "test category" }

    const result = await init({
      category: {
        config: mockConfig,
        query,
        cssSelector: ".category",
        render: () => Promise.resolve(null as never)
      }
    })

    expect(result.category.store.getState().query).toEqual(query)
  })

  it("should pass query to serp store", async () => {
    const query = { query: "test serp" }

    const result = await init({
      serp: {
        config: mockConfig,
        query,
        cssSelector: ".serp",
        render: () => Promise.resolve(null as never)
      }
    })

    expect(result.serp.store.getState().query).toEqual(query)
  })

  it("should handle undefined query for category", async () => {
    const result = await init({
      category: {
        config: mockConfig,
        cssSelector: ".category",
        render: () => Promise.resolve(null as never)
      }
    })

    expect(result.category.store.getState().query).toEqual({})
  })

  it("should handle undefined query for serp", async () => {
    const result = await init({
      serp: {
        config: mockConfig,
        cssSelector: ".serp",
        render: () => Promise.resolve(null as never)
      }
    })

    expect(result.serp.store.getState().query).toEqual({})
  })
})
