import { describe, expect, it } from "vitest"
import { generateThumbnailUrl } from "../../src/thumbnails/generateThumbnailUrl"
import { mockSettings } from "@nosto/nosto-js/testing"

describe("generateThumbnailUrl", () => {
  mockSettings({
    account: "1111",
    thumbnailHost: "thumbs.nosto.com"
  })

  it("should generate the correct URL", () => {
    const url = generateThumbnailUrl({
      size: "2",
      productId: "2222",
      hash: "3333"
    })
    expect(url).toEqual("https://thumbs.nosto.com/1111/2/2222/3333/A")
  })

  it("should also support usage without a hash", () => {
    const url = generateThumbnailUrl({
      size: "2",
      productId: "2222"
    })
    expect(url).toEqual("https://thumbs.nosto.com/1111/2/2222")
  })
})
