import { render } from "@testing-library/preact"
import { ComponentChildren } from "preact"
import { JSX } from "preact/jsx-runtime"
import { describe, expect, it, vi } from "vitest"

import { renderHeadless } from "../../src/dom/renderHeadless"

const expectJsxEqual = (a: ComponentChildren, b: ComponentChildren) => {
  expect(render(a).container.innerHTML).toEqual(render(b).container.innerHTML)
}

describe("renderHeadless", () => {
  it("should render headless component with updated elements", () => {
    const children = <div>Test content</div>
    const updateElement = (vnode: JSX.Element) => {
      vnode.type = "span"
      return vnode
    }

    const result = renderHeadless({ children, updateElement })
    expectJsxEqual(result, <span>Test content</span>)
  })

  it("should render headless component without updating elements", () => {
    const children = <div>Test content</div>
    const updateElement = (vnode: JSX.Element) => {
      return vnode
    }

    const result = renderHeadless({ children, updateElement })
    expectJsxEqual(result, <div>Test content</div>)
  })

  it("should render headless component with removed elements", () => {
    const children = (
      <div>
        <span>Test content</span>
        <p>Additional content</p>
      </div>
    )
    const updateElement = (vnode: JSX.Element) => {
      if (vnode.type === "span") {
        return null
      }
      return vnode
    }

    const result = renderHeadless({ children, updateElement })
    expectJsxEqual(
      result,
      <div>
        <p>Additional content</p>
      </div>
    )
  })

  it("should render headless component with mutated elements", () => {
    const children = (
      <div id="parent">
        <span id="child">Test content</span>
        <p>Additional content</p>
      </div>
    )
    const updateElement = (vnode: JSX.Element) => {
      if (vnode.type === "span") {
        vnode.props.children = "Updated content"
      }
      return vnode
    }

    const result = renderHeadless({ children, updateElement })
    expectJsxEqual(
      result,
      <div id="parent">
        <span id="child">Updated content</span>
        <p>Additional content</p>
      </div>
    )
  })

  it("should render headless component with a custom property", () => {
    const children = <button>Button</button>
    const updateElement = (vnode: JSX.Element) => {
      vnode.props = {
        ...vnode.props,
        "data-testid": "button"
      }
      return vnode
    }

    const result = renderHeadless({ children, updateElement })
    expectJsxEqual(result, <button data-testid="button">Button</button>)
  })

  it("should render headless component with attached events", () => {
    const children = <button>Button</button>
    const onClickSpy = vi.fn()
    const updateElement = (vnode: JSX.Element) => {
      vnode.props = {
        ...vnode.props,
        onClick: onClickSpy
      }
      return vnode
    }

    const result = render(renderHeadless({ children, updateElement }))
    result.getByText("Button").click()
    expect(onClickSpy).toHaveBeenCalled()
  })

  it("should render attached events on deep children with early return", () => {
    const children = (
      <>
        <input type="text" />
        <span class="wrapper">
          <button>Button</button>
        </span>
      </>
    )
    const onClickSpy = vi.fn()
    const updateElement = (vnode: JSX.Element) => {
      if (vnode.type !== "button") {
        return vnode
      }
      vnode.props = {
        ...vnode.props,
        onClick: onClickSpy
      }
      return vnode
    }

    const result = render(renderHeadless({ children, updateElement }))
    result.getByText("Button").click()
    expect(onClickSpy).toHaveBeenCalled()
  })
})
