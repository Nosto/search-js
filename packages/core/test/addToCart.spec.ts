import { beforeEach, describe, expect, it, Mock, vi } from "vitest"
vi.mock("@nosto/nosto-js", async importOriginal => ({
  ...(await importOriginal()),
  addSkuToCart: vi.fn()
}))

import { addSkuToCart } from "@nosto/nosto-js"
import { mockNostojs } from "@nosto/nosto-js/testing"

import { addToCart } from "../src/addToCart"

describe("addToCart", () => {
  const recordSearchAddToCart = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    mockNostojs({ recordSearchAddToCart })
  })

  it("should add a search hit to the cart and record the action", async () => {
    const hit = { productId: "123", skuId: "sku-123" }
    const quantity = 2

    await addToCart("serp", hit, quantity)

    expect(addSkuToCart).toHaveBeenCalledWith(hit, undefined, quantity)
    expect(recordSearchAddToCart).toHaveBeenCalledWith("serp", hit)
  })

  it("should throw an error if window.Nosto is not available", async () => {
    ;(addSkuToCart as Mock).mockImplementation(() => Promise.reject(new Error("Nosto is not available")))

    const hit = { productId: "123", skuId: "sku-123" }

    await expect(addToCart("serp", hit)).rejects.toThrow()
  })
})
