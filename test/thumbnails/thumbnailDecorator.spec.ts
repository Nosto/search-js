import { beforeEach, describe, expect, it } from "vitest"
import { thumbnailDecorator } from "../../src/thumbnails/thumbnailDecorator"
import { SearchProduct } from "@nosto/nosto-js/client"
import { mockSettings } from "@nosto/nosto-js/testing"

describe("thumbnailDecorator", () => {
  beforeEach(() => {
    mockSettings({
      account: "accountId",
      thumbnailHost: "thumbs.nosto.com"
    })
  })
  it("should replace the product image url", () => {
    const decorator = thumbnailDecorator({
      size: "13"
    })

    const result = decorator({
      productId: "productId",
      imageHash: "imageHash",
      imageUrl: "oldUrl",
      thumbHash: "thumbHash",
      thumbUrl: "oldUrl",
      alternateImageUrls: ["oldUrl"],
      alternateImageHashes: ["altHash"],
      skus: [
        {
          imageUrl: "oldUrl",
          imageHash: "skuHash"
        }
      ]
    })
    expect(result.imageUrl).toEqual("https://thumbs.nosto.com/accountId/13/productId/imageHash/A")
    expect(result.thumbUrl).toEqual("https://thumbs.nosto.com/accountId/13/productId/thumbHash/A")
    expect(result.alternateImageUrls?.[0]).toEqual("https://thumbs.nosto.com/accountId/13/productId/altHash/A")
    expect(result.skus?.[0]?.imageUrl).toEqual("https://thumbs.nosto.com/accountId/13/productId/skuHash/A")
  })

  it("handles numeric size as well", () => {
    const decorator = thumbnailDecorator({
      // @ts-expect-error we secretly accept numbers as well
      size: 13
    })

    const result = decorator({
      productId: "productId",
      imageHash: "imageHash",
      imageUrl: "oldUrl"
    })
    expect(result.imageUrl).toEqual("https://thumbs.nosto.com/accountId/13/productId/imageHash/A")
  })

  it("does not modify object if productId is not provided", () => {
    const decorator = thumbnailDecorator({
      size: "13"
    })

    const mockProduct: SearchProduct = {
      imageHash: "imageHash",
      imageUrl: "oldUrl",
      productId: undefined
    }

    const result = decorator(mockProduct)
    expect(result).toEqual(mockProduct)
  })

  it("does not modify imageUrl if imageHash is not provided", () => {
    const decorator = thumbnailDecorator({
      size: "13"
    })

    const mockProduct: SearchProduct = {
      productId: "productId",
      imageUrl: "oldUrl",
      imageHash: undefined
    }

    const result = decorator(mockProduct)
    expect(result).toEqual(mockProduct)
  })

  it("does not modify thumbUrl if thumbHash is not provided", () => {
    const decorator = thumbnailDecorator({
      size: "13"
    })

    const mockProduct: SearchProduct = {
      productId: "productId",
      thumbUrl: "oldUrl",
      thumbHash: undefined
    }

    const result = decorator(mockProduct)
    expect(result).toEqual(mockProduct)
  })

  it("does not modify alternateImageUrls if hash is not provided", () => {
    const decorator = thumbnailDecorator({
      size: "13"
    })

    const result = decorator({
      productId: "productId",
      alternateImageUrls: ["oldUrl"]
    })
    expect(result.alternateImageUrls?.[0]).toEqual("oldUrl")
  })

  it("does not modify skus if hash is not provided", () => {
    const decorator = thumbnailDecorator({
      size: "13"
    })

    const result = decorator({
      productId: "productId",
      skus: [
        {
          imageUrl: "oldUrl",
          imageHash: undefined
        },
        {
          imageUrl: "oldUrl",
          imageHash: "imageHash"
        }
      ]
    })

    expect(result.skus?.[0].imageUrl).toEqual("oldUrl")
    expect(result.skus?.[1].imageUrl).toEqual("https://thumbs.nosto.com/accountId/13/productId/imageHash/A")
  })
})
