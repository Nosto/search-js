import { describe, expect, it, vi } from "vitest"

import { bindBlur } from "../src/bindBlur"

describe("bindBlur", () => {
  it("should bind blur event", () => {
    const element = document.createElement("div")
    const callback = vi.fn()
    document.body.appendChild(element)

    bindBlur(element, callback)

    element.dispatchEvent(new Event("blur"))
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it("should call callback when element loses focus", () => {
    const element = document.createElement("input")
    const callback = vi.fn()
    document.body.appendChild(element)

    bindBlur(element, callback)

    element.focus()
    element.blur()

    expect(callback).toHaveBeenCalled()
  })
})
