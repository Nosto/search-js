import { describe } from "node:test"

import transformSearchQuery from "@preact/hooks/useLoadMore/transformSearchQuery"
import * as utils from "@utils/isBot"
import { expect, it, vi } from "vitest"

describe("transformSearchQuery", () => {
  const isBot = vi.spyOn(utils, "isBot")
  const searchQuery = { products: { from: 0, size: 10 } }
  const pageSearchQueryProps = { from: 0, size: 10, pageSize: 5 }

  function test(expected: object, bot: boolean, cache: boolean) {
    isBot.mockReturnValue(bot)
    const result = transformSearchQuery({ searchQuery, pageSearchQueryProps, cache })
    expect(result).toEqual(expected)
  }

  it("should transform query based on page options", () => {
    test({ products: { from: 5, size: 5 } }, false, false)
  })

  it("should transform query for bots", () => {
    test({ products: { from: 5, size: 10 } }, true, false)
  })

  it("should transform query for caching", () => {
    test({ products: { from: 0, size: 15 } }, false, true)
  })
})
