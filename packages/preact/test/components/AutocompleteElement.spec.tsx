import * as nostojs from "@nosto/nosto-js"
import { AutocompleteElement } from "@preact/components/Autocomplete/AutocompleteElement"
import { render } from "@testing-library/preact"
import { describe, expect, it, vi, vitest } from "vitest"

describe("AutocompleteElement", () => {
  vi.mock("@nosto/nosto-js", () => ({
    nostojs: vi.fn()
  }))
  const nostoJsSpy = vitest.spyOn(nostojs, "nostojs")

  const mockHit = {
    productId: "123",
    url: "https://example.com/product/123",
    keyword: "example"
  }

  it("renders children correctly", () => {
    const { getByText } = render(
      <AutocompleteElement hit={mockHit}>
        <a href={mockHit.url}>Test Product</a>
      </AutocompleteElement>
    )
    expect(getByText("Test Product")).toBeDefined()
  })

  it("should only call original onclick if hit is not provided", () => {
    const onClickMock = vi.fn()
    const { getByText } = render(
      <AutocompleteElement>
        <a href={mockHit.url} onClick={onClickMock}>
          Test Product
        </a>
      </AutocompleteElement>
    )
    getByText("Test Product").click()
    expect(nostoJsSpy).not.toHaveBeenCalled()
    expect(onClickMock).toHaveBeenCalled()
  })

  it("should call tracking request and original onclick", () => {
    const onClickMock = vi.fn()
    const { getByText } = render(
      <AutocompleteElement hit={mockHit}>
        <a href={mockHit.url} onClick={onClickMock}>
          Test Product
        </a>
      </AutocompleteElement>
    )
    getByText("Test Product").click()
    expect(nostoJsSpy).toHaveBeenCalled()
    expect(onClickMock).toHaveBeenCalled()
  })

  it("should call tracking request and original onclick on custom component", () => {
    const onClickMock = vi.fn()

    function CustomComponent() {
      return (
        <a href={mockHit.url} onClick={onClickMock}>
          Custom Component
        </a>
      )
    }

    const { getByText } = render(
      <AutocompleteElement hit={mockHit}>
        <CustomComponent />
      </AutocompleteElement>
    )
    getByText("Custom Component").click()
    expect(nostoJsSpy).toHaveBeenCalled()
    expect(onClickMock).toHaveBeenCalled()
  })

  it("throws an error if children are invalid", () => {
    expect(() => render(<AutocompleteElement hit={mockHit}>{null}</AutocompleteElement>)).toThrow(
      "AutocompleteElement expects a single valid VNode child element."
    )
  })
})
