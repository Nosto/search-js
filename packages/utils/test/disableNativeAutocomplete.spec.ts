import { beforeEach, describe, expect, it } from "vitest"

import { disableNativeAutocomplete } from "../src/disableNativeAutocomplete"

describe("disableNativeAutocomplete", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
  })

  it("should set autocomplete attribute to off", () => {
    const input = document.createElement("input")
    document.body.appendChild(input)

    disableNativeAutocomplete(input)

    expect(input.getAttribute("autocomplete")).toBe("off")
  })

  it("should override existing autocomplete attribute", () => {
    const input = document.createElement("input")
    input.setAttribute("autocomplete", "on")
    document.body.appendChild(input)

    expect(input.getAttribute("autocomplete")).toBe("on")

    disableNativeAutocomplete(input)

    expect(input.getAttribute("autocomplete")).toBe("off")
  })
})
