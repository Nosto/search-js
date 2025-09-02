import { mockNostojs } from "@nosto/nosto-js/testing"
import { createStore } from "@preact/common/store/store"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { init } from "../src/init"

// Mock the injection functions
vi.mock("../src/init/injectAutocomplete", () => ({
  injectAutocomplete: vi.fn()
}))

vi.mock("../src/init/injectCategory", () => ({
  injectCategory: vi.fn()
}))

vi.mock("../src/init/injectSerp", () => ({
  injectSerp: vi.fn()
}))

// Mock the store creation
vi.mock("@preact/common/store/store", () => ({
  createStore: vi.fn()
}))

describe("init", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockNostojs()
    vi.mocked(createStore).mockReturnValue({ getState: () => ({}) } as ReturnType<typeof createStore>)
  })

  it("should pass query to autocomplete store", async () => {
    const query = { query: "test autocomplete" }

    await init({
      autocomplete: {
        config: {
          defaultCurrency: "USD",
          search: {}
        },
        query,
        formCssSelector: "form",
        inputCssSelector: "input",
        dropdownCssSelector: ".dropdown"
      }
    })

    expect(createStore).toHaveBeenCalledWith({ query })
  })

  it("should pass query to category store", async () => {
    const query = { query: "test category" }

    await init({
      category: {
        config: {
          defaultCurrency: "USD",
          search: {}
        },
        query,
        cssSelector: ".category",
        render: () => Promise.resolve(null as never)
      }
    })

    expect(createStore).toHaveBeenCalledWith({ query })
  })

  it("should pass query to serp store", async () => {
    const query = { query: "test serp" }

    await init({
      serp: {
        config: {
          defaultCurrency: "USD",
          search: {}
        },
        query,
        cssSelector: ".serp",
        render: () => Promise.resolve(null as never)
      }
    })

    expect(createStore).toHaveBeenCalledWith({ query })
  })

  it("should handle undefined query for category", async () => {
    await init({
      category: {
        config: {
          defaultCurrency: "USD",
          search: {}
        },
        cssSelector: ".category",
        render: () => Promise.resolve(null as never)
      }
    })

    expect(createStore).toHaveBeenCalledWith({ query: undefined })
  })

  it("should handle undefined query for serp", async () => {
    await init({
      serp: {
        config: {
          defaultCurrency: "USD",
          search: {}
        },
        cssSelector: ".serp",
        render: () => Promise.resolve(null as never)
      }
    })

    expect(createStore).toHaveBeenCalledWith({ query: undefined })
  })
})
