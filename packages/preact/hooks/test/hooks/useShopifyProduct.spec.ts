import { act, waitFor } from "@testing-library/preact"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { ShopifyProduct } from "../../src/useShopifyProduct/types"
import { clearShopifyProductCache, useShopifyProduct } from "../../src/useShopifyProduct/useShopifyProduct"
import { expectStable } from "../mocks/expectStable"
import { renderHookWithProviders } from "../mocks/renderHookWithProviders"

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

const mockProduct: Partial<ShopifyProduct> = {
  id: 123456789,
  title: "Test Product",
  handle: "test-product",
  price: 2999,
  available: true
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
    const mockProduct2: Partial<ShopifyProduct> = {
      id: 999888777,
      title: "Another Product",
      handle: "another-product",
      price: 1999,
      available: false
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
    const mockProduct2: Partial<ShopifyProduct> = {
      id: 999888777,
      title: "Updated Product",
      handle: "updated-product",
      price: 3999,
      available: true
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

  it("maintains consistent object values on re-render", () => {
    const { result, rerender } = renderHookWithProviders(() => useShopifyProduct("test-product"))
    const firstRender = result.current

    // Force re-render without state change
    rerender()
    const secondRender = result.current

    // Object values should be consistent when state hasn't changed
    expectStable(firstRender, secondRender)
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
