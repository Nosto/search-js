import type { SearchProduct, SearchProductSku } from "@nosto/nosto-js/client"
import { useDecoratedSearchResults, useSwatches } from "@nosto/search-js/preact/hooks"
import { SerpElement } from "@nosto/search-js/preact/serp"

import ProductSwatches from "../../pages/Search/components/ProductSwatches"
import { hitDecorators } from "../../utils/hitDecorators"
import { productImagePlaceholder } from "../../utils/productImagePlaceholder"
import { productCardStyles, styles } from "./ProductCard.styles"

type Props = {
  product: SearchProduct
}

export function ProductCard({ product: baseProduct }: Props) {
  const product = useDecoratedSearchResults<typeof hitDecorators>(baseProduct)
  const tags = [
    product.onDiscount
      ? {
          label: "Sale",
          class: "ns-badge ns-badge-green-outline ns-d-inline-block ns-text-align-center"
        }
      : undefined
  ].filter(v => !!v)

  const { matchedSkus, swatches, toggleOption } = useSwatches(product.skus, ["size"])
  const previewImage = matchedSkus[0]?.imageUrl || productImagePlaceholder

  const handleAddToCart = (sku: SearchProductSku) => {
    console.log(sku)
  }

  const skuToAdd = matchedSkus[0]

  return (
    <>
      <style>{productCardStyles}</style>
      <SerpElement
        hit={{
          ...product,
          productId: product.productId!
        }}
        as={"a"}
        componentProps={{
          href: product.url,
          "aria-label": `Product ${product.name}`,
          className: "product-card",
          style: styles.card
        }}
      >
        <div style={styles.imageContainer}>
          {/* Blurred background image */}
          <img src={product.imageUrl ?? previewImage} alt="" style={styles.backgroundImage} />
          {/* Main image with contain */}
          <img
            src={product.imageUrl ?? previewImage}
            alt={product.name}
            width="300"
            height="300"
            style={styles.mainImage}
          />
          {tags.length > 0 && (
            <div style={styles.tagContainer}>
              {tags.map(v => (
                <span key={v.label} style={styles.tag}>
                  {v.label}
                </span>
              ))}
            </div>
          )}
        </div>

        <div data-nosto-element="product" style={styles.content}>
          {product.brand && <div style={styles.brand}>{product.brand}</div>}

          <div style={styles.name}>{product.name}</div>

          <div style={styles.priceContainer}>
            {product.price && <span style={styles.price}>{product.priceText}</span>}
            {product.price && product.listPrice && product.listPrice > product.price && (
              <span style={styles.listPrice}>{product.listPriceText}</span>
            )}
          </div>

          {swatches && swatches.length > 0 && (
            <div style={styles.swatchesContainer}>
              <ProductSwatches swatches={swatches} toggleOption={toggleOption} />
            </div>
          )}

          {matchedSkus.length === 1 && (
            <button
              onClick={e => {
                e.preventDefault()
                handleAddToCart(skuToAdd)
              }}
              className="add-to-cart-button"
              style={styles.addToCartButton}
            >
              Add to Cart
            </button>
          )}
        </div>
      </SerpElement>
    </>
  )
}
