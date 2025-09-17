import { beforeEach, describe, expect, it } from "vitest"

import { findAll } from "../src/findAll"

describe("findAll", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
  })

  it("should find all elements matching the selector", () => {
    document.body.innerHTML = `
      <div class="test">Element 1</div>
      <div class="test">Element 2</div>
      <div class="other">Element 3</div>
    `

    const elements = findAll<HTMLDivElement>(".test")
    expect(elements).toHaveLength(2)
    expect(elements[0].textContent).toBe("Element 1")
    expect(elements[1].textContent).toBe("Element 2")
  })

  it("should return empty array when no elements match", () => {
    document.body.innerHTML = `<div class="other">Element</div>`

    const elements = findAll<HTMLDivElement>(".test")
    expect(elements).toHaveLength(0)
  })

  it("should return all elements when using universal selector", () => {
    document.body.innerHTML = `
      <div>Div</div>
      <span>Span</span>
      <p>Paragraph</p>
    `

    const elements = findAll<Element>("*")
    expect(elements.length).toBeGreaterThan(0)
  })

  it("should work with complex selectors", () => {
    document.body.innerHTML = `
      <div class="container">
        <span class="item active">Active item</span>
        <span class="item">Regular item</span>
      </div>
    `

    const elements = findAll<HTMLSpanElement>(".container .item.active")
    expect(elements).toHaveLength(1)
    expect(elements[0].textContent).toBe("Active item")
  })
})
