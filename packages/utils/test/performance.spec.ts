import { measure } from "@utils/performance"
import { describe, expect, it, vi } from "vitest"

describe("performance", () => {
  vi.spyOn(window.performance, "mark")
  vi.spyOn(window.performance, "measure")
  it("creates the marks when measured", () => {
    const end = measure("test")
    end()

    expect(window.performance.mark).toHaveBeenCalledWith("nosto.search.test.start")
    expect(window.performance.mark).toHaveBeenCalledWith("nosto.search.test.end")
    expect(window.performance.measure).toHaveBeenCalledWith(
      "nosto.search.test",
      "nosto.search.test.start",
      "nosto.search.test.end"
    )
  })
})
