import { useEffect, useState } from "preact/hooks"

import { ShopifyProduct, UseShopifyProductState } from "./types"

interface CacheEntry {
  product: ShopifyProduct
  created: number
}

// Cache configuration
const TTL = 5 * 60 * 1000 // 5 minutes
const cache = new Map<string, CacheEntry>()

/**
 * Preact hook that fetches and exposes product data from Shopify's handle.js endpoint.
 *
 * @example
 * ```tsx
 * import { useShopifyProduct } from '@nosto/search-js/preact/hooks'
 *
 * export default function ProductPage() {
 *   const { product, loading, error } = useShopifyProduct("my-product-handle")
 *
 *   if (loading) return <div>Loading...</div>
 *   if (error) return <div>Error: {error}</div>
 *   if (!product) return <div>Product not found</div>
 *
 *   return (
 *     <div>
 *       <h1>{product.title}</h1>
 *       <p>{product.description}</p>
 *       <p>Price: ${product.price / 100}</p>
 *     </div>
 *   )
 * }
 * ```
 *
 * @param handle - The Shopify product handle
 * @returns Object containing product data, loading state, and error state
 * @group Hooks
 */
export function useShopifyProduct(handle: string): UseShopifyProductState {
  const [state, setState] = useState<UseShopifyProductState>({
    product: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    if (!handle) {
      setState({
        product: null,
        loading: false,
        error: "Product handle is required"
      })
      return
    }

    // Set loading state when handle changes
    setState(prevState => ({
      ...prevState,
      loading: true,
      error: null
    }))

    // Check cache first
    const cached = getFromCache(handle)
    if (cached) {
      setState({
        product: cached,
        loading: false,
        error: null
      })
      return
    }

    // Fetch from Shopify
    fetchShopifyProduct(handle)
      .then(product => {
        setCache(handle, product)
        setState({
          product,
          loading: false,
          error: null
        })
      })
      .catch(error => {
        setState({
          product: null,
          loading: false,
          error: error.message || "Failed to fetch product"
        })
      })
  }, [handle])

  return state
}

async function fetchShopifyProduct(handle: string): Promise<ShopifyProduct> {
  const response = await fetch(`/products/${handle}.js`)

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

function getFromCache(handle: string): ShopifyProduct | null {
  const entry = cache.get(handle)
  if (!entry) return null

  const isExpired = Date.now() - entry.created > TTL
  if (isExpired) {
    cache.delete(handle)
    return null
  }

  return entry.product
}

function setCache(handle: string, product: ShopifyProduct) {
  cache.set(handle, {
    product,
    created: Date.now()
  })
}

/**
 * Clears the product cache (useful for testing)
 */
export function clearShopifyProductCache() {
  cache.clear()
}
