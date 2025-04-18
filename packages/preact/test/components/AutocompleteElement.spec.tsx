import * as nostojs from "@nosto/nosto-js"
import { AutocompleteElement } from "@preact/components/Autocomplete/AutocompleteElement"
import { render } from "@testing-library/preact"
import { ComponentChildren } from "preact"
import { beforeEach, describe, expect, it, vi, vitest } from "vitest"

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

  beforeEach(() => {
    nostoJsSpy.mockClear()
  })

  function CustomComponent({
    url,
    children,
    onClickMock
  }: {
    url: string
    children: ComponentChildren
    onClickMock?: () => void
  }) {
    return (
      <a href={url} onClick={onClickMock}>
        {children}
      </a>
    )
  }

  it("renders children correctly", () => {
    const { getByText } = render(
      <AutocompleteElement hit={mockHit}>
        <a href={mockHit.url}>Test Product</a>
      </AutocompleteElement>
    )
    expect(getByText("Test Product")).toBeDefined()
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

  it.skip("should handle nested component", () => {
    const onClickMock = vi.fn()
    const { getByText } = render(
      <AutocompleteElement hit={mockHit}>
        <>
          <CustomComponent url={mockHit.url}>
            <a href={mockHit.url} onClick={onClickMock}>
              Custom Component
            </a>
          </CustomComponent>
        </>
      </AutocompleteElement>
    )

    getByText("Custom Component").click()
    expect(nostoJsSpy).toHaveBeenCalled()
    expect(onClickMock).toHaveBeenCalled()
  })

  it.skip("should handle multiple children gracefully", () => {
    const onClickMock = vi.fn()
    const { getByText } = render(
      <AutocompleteElement hit={mockHit}>
        <>
          <CustomComponent url={mockHit.url} onClickMock={onClickMock}>
            Custom Component
          </CustomComponent>
          <a href={mockHit.url} onClick={onClickMock}>
            ProductBox
          </a>
        </>
      </AutocompleteElement>
    )

    getByText("Custom Component").click()
    expect(nostoJsSpy).toHaveBeenCalled()
    expect(onClickMock).toHaveBeenCalled()
    getByText("ProductBox").click()
    expect(nostoJsSpy).toHaveBeenCalledTimes(2)
    expect(onClickMock).toHaveBeenCalledTimes(2)
  })

  // custom component is not currently supported
  it.skip("should call tracking request and original onclick on custom component", () => {
    const onClickMock = vi.fn()
    const { getByText } = render(
      <AutocompleteElement hit={mockHit}>
        <CustomComponent url={mockHit.url} onClickMock={onClickMock}>
          Custom Component
        </CustomComponent>
      </AutocompleteElement>
    )
    getByText("Custom Component").click()
    expect(nostoJsSpy).toHaveBeenCalled()
    expect(onClickMock).toHaveBeenCalled()
  })

  it("throws an error if children are invalid", () => {
    expect(() => render(<AutocompleteElement hit={mockHit}>{null}</AutocompleteElement>)).toThrow(
      "AutocompleteElement expects a single valid HTML element as its child (e.g., <div>, <a>). Custom components are not supported."
    )
  })

  it("throws an error if children are custom elements", () => {
    expect(() =>
      render(
        <AutocompleteElement hit={mockHit}>
          <CustomComponent url="#">Element</CustomComponent>
        </AutocompleteElement>
      )
    ).toThrow(
      "AutocompleteElement expects a single valid HTML element as its child (e.g., <div>, <a>). Custom components are not supported."
    )
  })
})
