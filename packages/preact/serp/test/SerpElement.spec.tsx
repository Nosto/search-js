import { mockNostojs } from "@nosto/nosto-js/testing"
import { makeAutocompleteConfig } from "@preact/autocomplete/AutocompleteConfig"
import { ConfigContext } from "@preact/common/config/configContext"
import { createStore } from "@preact/common/store/store"
import { StoreContext } from "@preact/common/store/storeContext"
import { SerpElement } from "@preact/serp/components/SerpElement"
import { makeSerpConfig } from "@preact/serp/SerpConfig"
import { render } from "@testing-library/preact"
import { beforeEach, describe, expect, it, vi } from "vitest"

describe("SerpElement", () => {
  const hit = {
    productId: "1",
    url: "/product/1"
  }

  beforeEach(() => {
    mockNostojs({
      recordSearchClick: vi.fn()
    })
  })

  describe("should handle clicking exactly once", () => {
    it("works with anchor tags", () => {
      const children = (
        <div>
          <a href="/test">Anchor</a>
        </div>
      )

      const onClick = vi.fn().mockImplementation(event => {
        event.preventDefault()
      })
      const result = render(
        <ConfigContext value={makeAutocompleteConfig({})}>
          <SerpElement hit={hit} componentProps={{ onClick }}>
            {children}
          </SerpElement>
        </ConfigContext>
      )

      result.getByText("Anchor").click()
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it("works with buttons", () => {
      const children = (
        <div>
          <button>Button</button>
        </div>
      )

      const onClick = vi.fn()
      const result = render(
        <ConfigContext value={makeAutocompleteConfig({})}>
          <SerpElement as={"a"} hit={hit} componentProps={{ onClick }}>
            {children}
          </SerpElement>
        </ConfigContext>
      )

      result.getByText("Button").click()
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it("works with other elements", () => {
      const children = (
        <div>
          <div>Clickable div</div>
        </div>
      )

      const onClick = vi.fn()
      const result = render(
        <ConfigContext value={makeAutocompleteConfig({})}>
          <SerpElement as={"a"} hit={hit} componentProps={{ onClick }}>
            {children}
          </SerpElement>
        </ConfigContext>
      )

      result.getByText("Clickable div").click()
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it("works with top level anchor", () => {
      const children = <a href="/test">Anchor</a>

      const onClick = vi.fn().mockImplementation(event => {
        event.preventDefault()
      })
      const result = render(
        <ConfigContext value={makeAutocompleteConfig({})}>
          <SerpElement as={"a"} hit={hit} componentProps={{ onClick }}>
            {children}
          </SerpElement>
        </ConfigContext>
      )

      result.getByText("Anchor").click()
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it("accepts the 'as' prop", () => {
      const children = <div>Button text</div>

      const onClick = vi.fn()
      const result = render(
        <ConfigContext value={makeAutocompleteConfig({})}>
          <SerpElement as={"button"} componentProps={{ onClick }} hit={hit}>
            {children}
          </SerpElement>
        </ConfigContext>
      )

      result.getByText("Button text").click()
      expect(onClick).toHaveBeenCalledTimes(1)
    })
  })

  describe("page scroll", () => {
    const scrollPosStorageKey = "nosto:search-js:scrollPos"

    beforeEach(() => {
      sessionStorage.clear()
    })

    it("is saved on click when preservePageScroll is enabled", () => {
      const result = render(
        <ConfigContext value={makeSerpConfig({ preservePageScroll: true })}>
          <SerpElement hit={hit}>Product</SerpElement>
        </ConfigContext>
      )

      result.getByText("Product").click()
      expect(sessionStorage.getItem(scrollPosStorageKey)).not.toBeNull()
    })

    it("saves the loaded product count on click", () => {
      const result = render(
        <ConfigContext value={makeSerpConfig({ preservePageScroll: true })}>
          <StoreContext value={createStore({ query: { products: { size: 72 } } })}>
            <SerpElement hit={hit}>Product</SerpElement>
          </StoreContext>
        </ConfigContext>
      )

      result.getByText("Product").click()
      expect(JSON.parse(sessionStorage.getItem(scrollPosStorageKey)!)).toMatchObject({ productCount: 72 })
    })

    it("is not saved on click when preservePageScroll is disabled", () => {
      const result = render(
        <ConfigContext value={makeSerpConfig()}>
          <SerpElement hit={hit}>Product</SerpElement>
        </ConfigContext>
      )

      result.getByText("Product").click()
      expect(sessionStorage.getItem(scrollPosStorageKey)).toBeNull()
    })
  })

  it("should not add onClick to nested children", () => {
    const children = (
      <div>
        <a href="/test">Test</a>
        <button>Click me</button>
        <div>Clickable div</div>
      </div>
    )

    const result = render(
      <ConfigContext value={makeAutocompleteConfig({})}>
        <SerpElement as={"a"} hit={hit} componentProps={{ onClick: vi.fn() }}>
          {children}
        </SerpElement>
      </ConfigContext>
    )

    expect(result.getByText("Test")).toBeDefined()
    expect(result.getByText("Click me")).toBeDefined()
    expect(result.getByText("Clickable div")).toBeDefined()
    expect(result.getByText("Test").onclick).toBeNull()
    expect(result.getByText("Click me").onclick).toBeNull()
    expect(result.getByText("Clickable div").onclick).toBeNull()
  })
})
