import { mockNostojs } from "@nosto/nosto-js/testing"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { addToCart } from "../src/addToCart"

describe("addToCart", () => {
  const recordSearchAddToCart = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    window.Nosto = { addSkuToCart: vi.fn() }
    mockNostojs({ recordSearchAddToCart })
  })

  it("should add a search hit to the cart and record the action", async () => {
    const hit = { productId: "123", skuId: "sku-123" }
    const quantity = 2

    await addToCart("serp", hit, quantity)

    expect(window.Nosto?.addSkuToCart).toHaveBeenCalledWith(hit, undefined, quantity)
    expect(recordSearchAddToCart).toHaveBeenCalledWith("serp", hit)
  })

  it("should throw an error if window.Nosto is not available", async () => {
    delete window.Nosto

    const hit = { productId: "123", skuId: "sku-123" }

    await expect(addToCart("serp", hit)).rejects.toThrow("window.Nosto.addSkuToCart is not available")
  })
})
