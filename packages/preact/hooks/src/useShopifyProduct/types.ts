/**
 * Shopify product data structure from handle.js endpoint
 */
export interface ShopifyProduct {
  id: number
  title: string
  handle: string
  description: string
  published_at: string
  created_at: string
  vendor: string
  type: string
  tags: string[]
  price: number
  price_min: number
  price_max: number
  available: boolean
  price_varies: boolean
  compare_at_price: number | null
  compare_at_price_min: number
  compare_at_price_max: number
  compare_at_price_varies: boolean
  variants: ShopifyVariant[]
  images: string[]
  featured_image: string
  options: ShopifyOption[]
  url: string
}

export interface ShopifyVariant {
  id: number
  title: string
  option1: string | null
  option2: string | null
  option3: string | null
  sku: string
  requires_shipping: boolean
  taxable: boolean
  featured_image: ShopifyImage | null
  available: boolean
  name: string
  public_title: string
  options: string[]
  price: number
  weight: number
  compare_at_price: number | null
  inventory_management: string
  barcode: string
  featured_media: ShopifyMedia
}

export interface ShopifyImage {
  id: number
  product_id: number
  position: number
  created_at: string
  updated_at: string
  alt: string | null
  width: number
  height: number
  src: string
  variant_ids: number[]
}

export interface ShopifyMedia {
  alt: string | null
  id: number
  position: number
  preview_image: ShopifyImage
}

export interface ShopifyOption {
  name: string
  position: number
  values: string[]
}

export interface UseShopifyProductState {
  product: ShopifyProduct | null
  loading: boolean
  error: string | null
}
