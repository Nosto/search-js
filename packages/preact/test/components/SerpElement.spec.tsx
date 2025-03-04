import { mockNostojs } from "@nosto/nosto-js/testing"
import { SerpElement } from "@preact/components/SerpElement"
import { ConfigContext } from "@preact/config/configContext"
import { makeAutocompleteConfig } from "@preact/config/pages/autocomplete/config"
import { render } from "@testing-library/preact"
import { beforeEach, describe, expect, it, vi } from "vitest"

describe("SerpElement", () => {
  const hit = {
    productId: "1",
    url: "/product/1"
  }

  beforeEach(() => {
    mockNostojs()
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
          <SerpElement hit={hit} onClick={onClick}>
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
          <SerpElement hit={hit} onClick={onClick}>
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
          <SerpElement hit={hit} onClick={onClick}>
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
          <SerpElement hit={hit} onClick={onClick}>
            {children}
          </SerpElement>
        </ConfigContext>
      )

      result.getByText("Anchor").click()
      expect(onClick).toHaveBeenCalledTimes(1)
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
        <SerpElement hit={hit} onClick={vi.fn()}>
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
