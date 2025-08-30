import { describe, expect, it } from "vitest"

import cl from "../src/cl"

describe("cl", () => {
  it("should join multiple string classes", () => {
    expect(cl("base", "active", "primary")).toBe("base active primary")
  })

  it("should filter out falsy values", () => {
    expect(cl("base", undefined, "active", null, "primary", false, "")).toBe("base active primary")
  })

  it("should handle empty input", () => {
    expect(cl()).toBe("")
  })

  it("should handle all falsy values", () => {
    expect(cl(undefined, null, false, "", 0)).toBe("")
  })

  it("should handle conditional classes", () => {
    const isActive = true
    const isDisabled = false
    expect(cl("base", isActive && "active", isDisabled && "disabled")).toBe("base active")
  })

  it("should handle mixed types that are truthy", () => {
    expect(cl("base", 1, "active", "test")).toBe("base 1 active test")
  })

  it("should handle single class", () => {
    expect(cl("single")).toBe("single")
  })

  it("should handle undefined single value", () => {
    expect(cl(undefined)).toBe("")
  })
})
