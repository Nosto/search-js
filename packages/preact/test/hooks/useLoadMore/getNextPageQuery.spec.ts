import { getNextPageQuery } from "@preact/hooks/useLoadMore/getNextPageQuery"
import { isBot } from "@utils/isBot"
import { describe, expect, it, vi } from "vitest"

describe("queryChanges for useLoadMore hook", () => {
  vi.mock("@utils/isBot", () => ({
    isBot: vi.fn()
  }))

  it("should increase 'from' value for bots", () => {
    vi.mocked(isBot).mockReturnValue(true)

    const result = getNextPageQuery({ from: 10, size: 20, pageSize: 5 })

    expect(result).toEqual({
      products: { from: 15 }
    })
  })

  it("should increase 'size' value for non-bots", () => {
    vi.mocked(isBot).mockReturnValue(false)

    const result = getNextPageQuery({ from: 10, size: 20, pageSize: 5 })

    expect(result).toEqual({
      products: { size: 25 }
    })
  })
})
