import { render } from "@testing-library/preact"
import { describe, expect, it } from "vitest"

describe("Custom component property binding", () => {
  class WithHandle extends HTMLElement {
    private _handle!: string

    constructor() {
      super()
    }

    get handle() {
      return this._handle
    }

    set handle(h: string) {
      this._handle = h
    }
  }

  class WithoutHandle extends HTMLElement {
    constructor() {
      super()
    }
  }

  customElements.define("with-handle", WithHandle)
  customElements.define("without-handle", WithoutHandle)

  it("should bind properties correctly", () => {
    // @ts-expect-error unknown JSX type
    const { container } = render(<with-handle handle="shoes" />)
    const element = container.firstElementChild as WithHandle
    expect(element.handle).toBe("shoes")
    expect(element.getAttribute("handle")).toBeNull()
  })

  it("should bind attributes correctly", () => {
    // @ts-expect-error unknown JSX type
    const { container } = render(<without-handle handle="shoes" />)
    const element = container.firstElementChild as WithoutHandle
    // @ts-expect-error not defined on type
    expect(element.handle).toBeUndefined()
    expect(element.getAttribute("handle")).toBe("shoes")
  })
})
