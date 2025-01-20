import { describe, expect, it } from "vitest"
import { thumbnailDecorator } from "../../src/thumbnails/thumbnailDecorator"
import { SearchProduct } from "@nosto/nosto-js/client"
import { mockSettings } from "@nosto/nosto-js/testing"
import { beforeEach } from "node:test"

const baseMockProduct: SearchProduct = {
  productId: "2222",
  thumbHash: "3333",
  thumbUrl: "BASE_IMAGE_URL",
  skus: [
    {
      imageUrl: "BASE_IMAGE_URL",
      imageHash: "5555"
    }
  ]
}

describe("thumbnailDecorator", () => {
  beforeEach(() => {
    mockSettings({
      account: "1111"
    })
  })
  it("should replace the product image url", () => {
    const decorator = thumbnailDecorator({
      size: "100x100"
    })

    const result = decorator(baseMockProduct)
    expect(result.thumbUrl).toEqual("https://thumbs.nosto.com/1111/100x100/2222/3333/A")
  })

  it("does not modify object if productId is not provided", () => {
    const decorator = thumbnailDecorator({
      size: "100x100"
    })

    const mockProduct = {
      ...baseMockProduct,
      productId: undefined
    }

    const result = decorator(mockProduct)
    expect(result).toEqual(mockProduct)
  })

  it("does not modify url if thumb hash is not provided", () => {
    const decorator = thumbnailDecorator({
      size: "100x100"
    })

    const mockProduct = {
      ...baseMockProduct,
      thumbHash: undefined,
      skus: []
    }

    const result = decorator(mockProduct)
    expect(result).toEqual(mockProduct)
  })

  it("should replace the sku image urls", () => {
    const decorator = thumbnailDecorator({
      size: "100x100"
    })

    const result = decorator(baseMockProduct)
    expect(result.skus?.[0].imageUrl).toEqual("https://thumbs.nosto.com/1111/100x100/2222/5555/A")
  })

  it("does not modify skus if hash is not provided", () => {
    const decorator = thumbnailDecorator({
      size: "100x100"
    })

    const mockProduct: SearchProduct = {
      ...baseMockProduct,
      skus: [
        {
          imageUrl: "BASE_IMAGE_URL",
          imageHash: undefined
        },
        {
          imageUrl: "BASE_IMAGE_URL",
          imageHash: "5555"
        }
      ]
    }

    const result = decorator(mockProduct)
    expect(result.skus?.[0].imageUrl).toEqual(undefined)
    expect(result.skus?.[1].imageUrl).toEqual("https://thumbs.nosto.com/1111/100x100/2222/5555/A")
  })
})
