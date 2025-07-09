import type { SearchProduct, SearchProductSku } from "@nosto/nosto-js/client"
import { useDecoratedSearchResults, useSwatches } from "@nosto/search-js/preact/hooks"
import { SerpElement } from "@nosto/search-js/preact/serp"

import ProductSwatches from "../../pages/Search/ProductSwatches"
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

  const testSKUs = [
    {
      id: "SKU-001",
      imageUrl: "https://via.placeholder.com/150?text=Red+Cotton",
      price: 19.99,
      customFields: [
        { key: "color", value: "Red" },
        { key: "size", value: "S" },
        { key: "material", value: "Cotton" }
      ]
    },
    {
      id: "SKU-002",
      imageUrl: "https://via.placeholder.com/150?text=Red+Silk",
      price: 24.99,
      customFields: [
        { key: "color", value: "Red" },
        { key: "size", value: "M" },
        { key: "material", value: "Silk" }
      ]
    },
    {
      id: "SKU-003",
      imageUrl: "https://via.placeholder.com/150?text=Blue+Cotton",
      price: 22.99,
      customFields: [
        { key: "color", value: "Blue" },
        { key: "size", value: "M" },
        { key: "material", value: "Cotton" }
      ]
    },
    {
      id: "SKU-004",
      imageUrl: "https://via.placeholder.com/150?text=Blue+Wool",
      customFields: [
        { key: "color", value: "Blue" },
        { key: "size", value: "L" },
        { key: "material", value: "Wool" }
      ]
    },
    {
      id: "SKU-005",
      imageUrl: "https://via.placeholder.com/150?text=Green+Silk",
      customFields: [
        { key: "color", value: "Green" },
        { key: "size", value: "S" },
        { key: "material", value: "Silk" }
      ]
    },
    {
      id: "SKU-006",
      imageUrl: "https://via.placeholder.com/150?text=Green+Wool",
      customFields: [
        { key: "color", value: "Green" },
        { key: "size", value: "XL" },
        { key: "material", value: "Wool" }
      ]
    }
  ]
  const { matchedSkus, swatches, toggleOption } = useSwatches(testSKUs, ["color", "size", "material"])
  const previewImage = matchedSkus[0]?.imageUrl || productImagePlaceholder

  const handleAddToCart = (sku: SearchProductSku) => {
    console.log(sku)
  }

  const skuToAdd = matchedSkus[0]

  return (
    <SerpElement
      hit={{
        ...product,
        productId: product.productId!
      }}
      as={"a"}
      componentProps={{
        href: product.url,
        "aria-label": `Product ${product.name}`,
        style: {
          display: "block",
          textDecoration: "none",
          color: "inherit",
          borderRadius: "12px",
          overflow: "hidden",
          transition: "all 0.2s ease",
          border: "1px solid #e5e7eb",
          background: "#ffffff",
          cursor: "pointer"
        },
        onMouseEnter: e => {
          e.currentTarget.style.transform = "translateY(-2px)"
          e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.1)"
          e.currentTarget.style.borderColor = "#d1d5db"
        },
        onMouseLeave: e => {
          e.currentTarget.style.transform = "translateY(0)"
          e.currentTarget.style.boxShadow = "none"
          e.currentTarget.style.borderColor = "#e5e7eb"
        }
      }}
    >
      <div style={{ position: "relative", height: "300px", overflow: "hidden" }}>
        {/* Blurred background image */}
        <img
          src={product.imageUrl ?? previewImage}
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(8px) brightness(0.8)",
            transform: "scale(1.1)",
            zIndex: 0
          }}
        />
        {/* Main image with contain */}
        <img
          src={product.imageUrl ?? previewImage}
          alt={product.name}
          width="300"
          height="300"
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
            zIndex: 1
          }}
        />
        {tags.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              zIndex: 1
            }}
          >
            {tags.map(v => (
              <span
                key={v.label}
                style={{
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
                }}
              >
                {v.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div
        data-nosto-element="product"
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}
      >
        {product.brand && (
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              lineHeight: 1
            }}
          >
            {product.brand}
          </div>
        )}

        <div
          style={{
            fontSize: "16px",
            fontWeight: 500,
            color: "#1f2937",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "42px"
          }}
        >
          {product.name}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "4px"
          }}
        >
          {product.price && (
            <span
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#059669"
              }}
            >
              {product.priceText}
            </span>
          )}
          {product.price && product.listPrice && product.listPrice > product.price && (
            <span
              style={{
                fontSize: "14px",
                color: "#9ca3af",
                textDecoration: "line-through"
              }}
            >
              {product.listPriceText}
            </span>
          )}
        </div>

        {swatches && swatches.length > 0 && (
          <div
            style={{
              marginTop: "12px",
              paddingTop: "12px",
              borderTop: "1px solid #f3f4f6"
            }}
          >
            <ProductSwatches swatches={swatches} toggleOption={toggleOption} />
          </div>
        )}

        {matchedSkus.length === 1 && (
          <button
            onClick={e => {
              e.preventDefault()
              handleAddToCart(skuToAdd)
            }}
            style={{
              marginTop: "12px",
              width: "100%",
              padding: "10px 16px",
              background: "#059669",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background-color 0.2s ease"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#047857"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#059669"
            }}
          >
            Add to Cart
          </button>
        )}
      </div>
    </SerpElement>
  )
}
