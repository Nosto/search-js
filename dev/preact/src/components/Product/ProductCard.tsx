import type { SearchProduct, SearchProductSku } from "@nosto/nosto-js/client"
import { useDecoratedSearchResults, useSwatches } from "@nosto/search-js/preact/hooks"
import { SerpElement } from "@nosto/search-js/preact/serp"

import { productCardCSS, productCardStyles } from "../../Component.styles"
import ProductSwatches from "../../pages/Search/components/ProductSwatches"
import { hitDecorators } from "../../utils/hitDecorators"
import { productImagePlaceholder } from "../../utils/productImagePlaceholder"

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
      <style>{productCardCSS}</style>
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
          style: productCardStyles.card
        }}
      >
        <div style={productCardStyles.imageContainer}>
          {/* Blurred background image */}
          <img src={product.imageUrl ?? previewImage} alt="" style={productCardStyles.backgroundImage} />
          {/* Main image with contain */}
          <img
            src={product.imageUrl ?? previewImage}
            alt={product.name}
            width="300"
            height="300"
            style={productCardStyles.mainImage}
          />
          {tags.length > 0 && (
            <div style={productCardStyles.tagContainer}>
              {tags.map(v => (
                <span key={v.label} style={productCardStyles.tag}>
                  {v.label}
                </span>
              ))}
            </div>
          )}
        </div>

        <div data-nosto-element="product" style={productCardStyles.content}>
          {product.brand && <div style={productCardStyles.brand}>{product.brand}</div>}

          <div style={productCardStyles.name}>{product.name}</div>

          <div style={productCardStyles.priceContainer}>
            {product.price && <span style={productCardStyles.price}>{product.priceText}</span>}
            {product.price && product.listPrice && product.listPrice > product.price && (
              <span style={productCardStyles.listPrice}>{product.listPriceText}</span>
            )}
          </div>

          {swatches && swatches.length > 0 && (
            <div style={productCardStyles.swatchesContainer}>
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
              style={productCardStyles.addToCartButton}
            >
              Add to Cart
            </button>
          )}
        </div>
      </SerpElement>
    </>
  )
}
