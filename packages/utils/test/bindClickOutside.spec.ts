import { beforeEach, describe, expect, it, vi } from "vitest"

import { bindClickOutside } from "../src/bindClickOutside"

describe("bindClickOutside", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
  })

  it("should call callback when clicking outside element", () => {
    const element = document.createElement("div")
    const input = document.createElement("input")
    const outsideElement = document.createElement("div")
    const callback = vi.fn()

    document.body.appendChild(element)
    document.body.appendChild(input)
    document.body.appendChild(outsideElement)

    const { destroy } = bindClickOutside([element, input], callback)

    outsideElement.click()
    expect(callback).toHaveBeenCalledTimes(1)

    destroy()
  })

  it("should not call callback when clicking on element", () => {
    const element = document.createElement("div")
    const input = document.createElement("input")
    const callback = vi.fn()

    document.body.appendChild(element)
    document.body.appendChild(input)

    const { destroy } = bindClickOutside([element, input], callback)

    element.click()
    expect(callback).not.toHaveBeenCalled()

    destroy()
  })

  it("should not call callback when clicking on input", () => {
    const element = document.createElement("div")
    const input = document.createElement("input")
    const callback = vi.fn()

    document.body.appendChild(element)
    document.body.appendChild(input)

    const { destroy } = bindClickOutside([element, input], callback)

    input.click()
    expect(callback).not.toHaveBeenCalled()

    destroy()
  })

  it("should not call callback when clicking on child element", () => {
    const element = document.createElement("div")
    const input = document.createElement("input")
    const childElement = document.createElement("span")
    const callback = vi.fn()

    element.appendChild(childElement)
    document.body.appendChild(element)
    document.body.appendChild(input)

    const { destroy } = bindClickOutside([element, input], callback)

    childElement.click()
    expect(callback).not.toHaveBeenCalled()

    destroy()
  })

  it("should handle non-HTMLElement targets gracefully", () => {
    const element = document.createElement("div")
    const input = document.createElement("input")
    const callback = vi.fn()

    document.body.appendChild(element)
    document.body.appendChild(input)

    const { destroy } = bindClickOutside([element, input], callback)

    // Create a click event with a non-HTMLElement target
    const event = new MouseEvent("click", { bubbles: true })
    Object.defineProperty(event, "target", { value: document.createTextNode("text") })
    document.dispatchEvent(event)

    expect(callback).not.toHaveBeenCalled()

    destroy()
  })
})
