import { act, waitFor } from "@testing-library/preact"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { clearShopifyProductCache, ShopifyProduct, useShopifyProduct } from "../../src/useShopifyProduct"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

const mockProduct: ShopifyProduct = {
  id: 123456789,
  title: "Test Product",
  handle: "test-product",
  description: "A test product description",
  published_at: "2023-01-01T00:00:00Z",
  created_at: "2023-01-01T00:00:00Z",
  vendor: "Test Vendor",
  type: "Test Type",
  tags: ["test", "product"],
  price: 2999,
  price_min: 2999,
  price_max: 2999,
  available: true,
  price_varies: false,
  compare_at_price: 3999,
  compare_at_price_min: 3999,
  compare_at_price_max: 3999,
  compare_at_price_varies: false,
  variants: [
    {
      id: 987654321,
      title: "Default Title",
      option1: null,
      option2: null,
      option3: null,
      sku: "TEST-SKU-001",
      requires_shipping: true,
      taxable: true,
      featured_image: null,
      available: true,
      name: "Test Product",
      public_title: "Default Title",
      options: [],
      price: 2999,
      weight: 100,
      compare_at_price: 3999,
      inventory_management: "shopify",
      barcode: "123456789012",
      featured_media: {
        alt: "Test image",
        id: 111,
        position: 1,
        preview_image: {
          id: 111,
          product_id: 123456789,
          position: 1,
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
          alt: "Test image",
          width: 800,
          height: 600,
          src: "https://cdn.shopify.com/test-image.jpg",
          variant_ids: [987654321]
        }
      }
    }
  ],
  images: ["https://cdn.shopify.com/test-image.jpg"],
  featured_image: "https://cdn.shopify.com/test-image.jpg",
  options: [],
  url: "/products/test-product"
}

describe("useShopifyProduct", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    clearShopifyProductCache()
  })

  it("should initialize with loading state", () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProduct)
    })

    const { result } = renderHookWithProviders(() => useShopifyProduct("test-product"))

    expect(result.current.loading).toBe(true)
    expect(result.current.product).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it("should fetch and return product data on success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProduct)
    })

    const { result } = renderHookWithProviders(() => useShopifyProduct("test-product"))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.product).toEqual(mockProduct)
    expect(result.current.error).toBe(null)
    expect(mockFetch).toHaveBeenCalledWith("/products/test-product.js")
  })

  it("should handle fetch errors", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found"
    })

    const { result } = renderHookWithProviders(() => useShopifyProduct("nonexistent-product"))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.product).toBe(null)
    expect(result.current.error).toBe("Failed to fetch product: 404 Not Found")
  })

  it("should handle network errors", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"))

    const { result } = renderHookWithProviders(() => useShopifyProduct("test-product"))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.product).toBe(null)
    expect(result.current.error).toBe("Network error")
  })

  it("should handle empty handle gracefully", () => {
    const { result } = renderHookWithProviders(() => useShopifyProduct(""))

    expect(result.current.loading).toBe(false)
    expect(result.current.product).toBe(null)
    expect(result.current.error).toBe("Product handle is required")
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it("should cache results and avoid duplicate requests", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProduct)
    })

    // First call
    const { result: result1 } = renderHookWithProviders(() => useShopifyProduct("test-product"))

    await waitFor(() => {
      expect(result1.current.loading).toBe(false)
    })

    expect(result1.current.product).toEqual(mockProduct)
    expect(mockFetch).toHaveBeenCalledTimes(1)

    // Second call should use cache
    const { result: result2 } = renderHookWithProviders(() => useShopifyProduct("test-product"))

    expect(result2.current.loading).toBe(false)
    expect(result2.current.product).toEqual(mockProduct)
    expect(result2.current.error).toBe(null)
    expect(mockFetch).toHaveBeenCalledTimes(1) // Still only called once
  })

  it("should handle different product handles independently", async () => {
    const mockProduct2: ShopifyProduct = {
      ...mockProduct,
      id: 999888777,
      title: "Another Product",
      handle: "another-product"
    }

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProduct)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProduct2)
      })

    // First product
    const { result: result1 } = renderHookWithProviders(() => useShopifyProduct("test-product"))

    await waitFor(() => {
      expect(result1.current.loading).toBe(false)
    })

    // Second product
    const { result: result2 } = renderHookWithProviders(() => useShopifyProduct("another-product"))

    await waitFor(() => {
      expect(result2.current.loading).toBe(false)
    })

    expect(result1.current.product?.title).toBe("Test Product")
    expect(result2.current.product?.title).toBe("Another Product")
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it("should refetch when handle changes", async () => {
    const mockProduct2: ShopifyProduct = {
      ...mockProduct,
      id: 999888777,
      title: "Updated Product",
      handle: "updated-product"
    }

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProduct)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProduct2)
      })

    const { result, rerender } = renderHookWithProviders(
      ({ handle }: { handle: string }) => useShopifyProduct(handle),
      { initialProps: { handle: "test-product" } }
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.product?.title).toBe("Test Product")

    // Change handle
    act(() => {
      rerender({ handle: "updated-product" })
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.product?.title).toBe("Updated Product")
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it("should expire cache after TTL", async () => {
    // Mock Date.now to control time
    const originalDateNow = Date.now
    let currentTime = 1000000000000 // Some fixed timestamp

    vi.spyOn(Date, "now").mockImplementation(() => currentTime)

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProduct)
    })

    // First call
    const { result: result1 } = renderHookWithProviders(() => useShopifyProduct("test-product"))

    await waitFor(() => {
      expect(result1.current.loading).toBe(false)
    })

    expect(mockFetch).toHaveBeenCalledTimes(1)

    // Move time forward by 4 minutes (less than TTL)
    currentTime += 4 * 60 * 1000

    // Second call should still use cache
    const { result: result2 } = renderHookWithProviders(() => useShopifyProduct("test-product"))

    expect(result2.current.loading).toBe(false)
    expect(result2.current.product).toEqual(mockProduct)
    expect(mockFetch).toHaveBeenCalledTimes(1)

    // Move time forward by 6 minutes (more than TTL)
    currentTime += 6 * 60 * 1000

    // Third call should fetch again
    const { result: result3 } = renderHookWithProviders(() => useShopifyProduct("test-product"))

    await waitFor(() => {
      expect(result3.current.loading).toBe(false)
    })

    expect(mockFetch).toHaveBeenCalledTimes(2)

    // Restore original Date.now
    Date.now = originalDateNow
  })
})
