interface Window {
  Nosto?: {
    addSkuToCart?(product: { productId: string; skuId: string }, element: undefined, quantity: number): Promise<void>
    shopifyScript?: boolean
  }
}
