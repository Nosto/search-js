import type { SearchProduct, SearchProductSku } from "@nosto/nosto-js/client"
import { useDecoratedSearchResults, useSwatches } from "@nosto/search-js/preact/hooks"
import { SerpElement } from "@nosto/search-js/preact/serp"

import ProductSwatches from "../../pages/Search/ProductSwatches"
import { hitDecorators } from "../../utils/hitDecorators"
import { productImagePlaceholder } from "../../utils/productImagePlaceholder"

type Props = {
  product: SearchProduct
}

const styles = {
  card: {
    display: "block",
    textDecoration: "none",
    color: "inherit",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    cursor: "pointer"
  },

  imageContainer: {
    position: "relative",
    height: "300px",
    overflow: "hidden"
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "blur(8px) brightness(0.8)",
    transform: "scale(1.1)",
    zIndex: 0
  },
  mainImage: {
    position: "relative",
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
    zIndex: 1
  },

  tagContainer: {
    position: "absolute",
    top: "12px",
    left: "12px",
    zIndex: 1
  },
  tag: {
    display: "inline-block",
    padding: "4px 8px",
    fontSize: "11px",
    fontWeight: 600,
    color: "#059669",
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    borderRadius: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },

  content: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },

  brand: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    lineHeight: 1
  },
  name: {
    fontSize: "16px",
    fontWeight: 500,
    color: "#1f2937",
    lineHeight: 1.3,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    minHeight: "42px"
  },

  priceContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "4px"
  },
  price: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#059669"
  },
  listPrice: {
    fontSize: "14px",
    color: "#9ca3af",
    textDecoration: "line-through"
  },

  swatchesContainer: {
    marginTop: "12px",
    paddingTop: "12px",
    borderTop: "1px solid #f3f4f6"
  },

  addToCartButton: {
    marginTop: "12px",
    width: "100%",
    padding: "10px 16px",
    background: "#059669",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer"
  }
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
      <style>{`
        .product-card {
          transition: all 0.2s ease;
        }
        .product-card:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
          border-color: #d1d5db !important;
        }
        .add-to-cart-button {
          transition: background-color 0.2s ease;
        }
        .add-to-cart-button:hover {
          background: #047857 !important;
        }
      `}</style>
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
