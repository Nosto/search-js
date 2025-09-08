import * as nostojs from "@nosto/nosto-js"
import { AutocompleteElement } from "@preact/autocomplete/components/AutocompleteElement"
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

  it("should call tracking request and original onclick on custom component", () => {
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

  it("supports direct props pattern", () => {
    const onClickMock = vi.fn()
    const { getByText } = render(
      <AutocompleteElement
        hit={mockHit}
        as="a"
        href="https://example.com"
        onClick={onClickMock}
        className="direct-props-class"
        data-testid="direct-props"
      >
        Direct Props Test
      </AutocompleteElement>
    )

    const element = getByText("Direct Props Test")
    expect(element).toBeDefined()
    expect(element.getAttribute("href")).toBe("https://example.com")
    expect(element.getAttribute("class")).toContain("direct-props-class")
    expect(element.getAttribute("class")).toContain("ns-autocomplete-element")
    expect(element.getAttribute("data-testid")).toBe("direct-props")

    element.click()
    expect(nostoJsSpy).toHaveBeenCalled()
    expect(onClickMock).toHaveBeenCalled()
  })
})
