import { describe, expect, it, vi } from "vitest"

import { bindClickOutside } from "../src/bindClickOutside"

describe("bindClickOutside", () => {
  it("should call callback when clicking outside element", () => {
    const element = document.createElement("div")
    const input = document.createElement("input")
    const outsideElement = document.createElement("div")
    const callback = vi.fn()

    document.body.appendChild(element)
    document.body.appendChild(input)
    document.body.appendChild(outsideElement)

    bindClickOutside({ element, input }, callback)

    outsideElement.click()
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it("should not call callback when clicking on element", () => {
    const element = document.createElement("div")
    const input = document.createElement("input")
    const callback = vi.fn()

    document.body.appendChild(element)
    document.body.appendChild(input)

    bindClickOutside({ element, input }, callback)

    element.click()
    expect(callback).not.toHaveBeenCalled()
  })

  it("should not call callback when clicking on input", () => {
    const element = document.createElement("div")
    const input = document.createElement("input")
    const callback = vi.fn()

    document.body.appendChild(element)
    document.body.appendChild(input)

    bindClickOutside({ element, input }, callback)

    input.click()
    expect(callback).not.toHaveBeenCalled()
  })

  it("should not call callback when clicking on child element", () => {
    const element = document.createElement("div")
    const input = document.createElement("input")
    const childElement = document.createElement("span")
    const callback = vi.fn()

    element.appendChild(childElement)
    document.body.appendChild(element)
    document.body.appendChild(input)

    bindClickOutside({ element, input }, callback)

    childElement.click()
    expect(callback).not.toHaveBeenCalled()
  })

  it("should handle clicks on document body", () => {
    const element = document.createElement("div")
    const input = document.createElement("input")
    const callback = vi.fn()

    document.body.appendChild(element)
    document.body.appendChild(input)

    bindClickOutside({ element, input }, callback)

    document.body.click()
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
