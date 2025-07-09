import type { SearchProduct } from "@nosto/nosto-js/client"
import { AutocompleteElement } from "@nosto/search-js/preact/autocomplete"
import { useDecoratedSearchResults } from "@nosto/search-js/preact/hooks"

import { hitDecorators } from "../../utils/hitDecorators"
import { productImagePlaceholder } from "../../utils/productImagePlaceholder"

type Props = {
  product: SearchProduct
}

export function ProductRow({ product: baseProduct }: Props) {
  const product = useDecoratedSearchResults<typeof hitDecorators>(baseProduct)

  return (
    <AutocompleteElement
      hit={{
        ...product,
        productId: product.productId!,
        url: product.url!
      }}
      as="a"
      componentProps={{
        href: product.url,
        style: {
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "8px 16px",
          textDecoration: "none",
          color: "inherit",
          borderRadius: "6px",
          transition: "background-color 0.15s ease",
          cursor: "pointer",
          minHeight: "56px"
        },
        "aria-label": `Product ${product.name}`,
        onMouseEnter: e => {
          e.currentTarget.style.backgroundColor = "#f3f4f6"
        },
        onMouseLeave: e => {
          e.currentTarget.style.backgroundColor = "transparent"
        }
      }}
    >
      <img
        src={product.thumbUrl ?? productImagePlaceholder}
        alt={product.name}
        width="44"
        height="44"
        style={{
          width: "44px",
          height: "44px",
          objectFit: "cover",
          borderRadius: "5px",
          flexShrink: 0,
          background: "#f3f4f6",
          display: "block",
          margin: 0
        }}
      />
      <div
        data-nosto-element="product"
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        {product.brand && (
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#9ca3af",
              marginBottom: "2px",
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
            fontSize: "15px",
            fontWeight: 500,
            color: "#1f2937",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {product.name}
        </div>
      </div>
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          minWidth: "70px"
        }}
      >
        {product.price && (
          <span
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#059669",
              lineHeight: 1
            }}
          >
            {product.priceText}
          </span>
        )}
        {product.price && product.listPrice && product.listPrice > product.price && (
          <span
            style={{
              fontSize: "13px",
              color: "#9ca3af",
              textDecoration: "line-through",
              marginTop: "2px"
            }}
          >
            {product.listPriceText}
          </span>
        )}
      </div>
    </AutocompleteElement>
  )
}
