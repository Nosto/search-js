import type { SearchProduct } from "@nosto/nosto-js/client"
import { AutocompleteElement } from "@nosto/search-js/preact/autocomplete"
import { useDecoratedSearchResults } from "@nosto/search-js/preact/hooks"

import { hitDecorators } from "../../utils/hitDecorators"
import { productImagePlaceholder } from "../../utils/productImagePlaceholder"

type Props = {
  product: SearchProduct
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 16px",
    textDecoration: "none",
    color: "inherit",
    borderRadius: "6px",
    cursor: "pointer",
    minHeight: "56px"
  },
  image: {
    width: "44px",
    height: "44px",
    objectFit: "cover" as const,
    borderRadius: "5px",
    flexShrink: 0,
    background: "#f3f4f6",
    display: "block",
    margin: 0
  },
  content: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center"
  },
  brand: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#9ca3af",
    marginBottom: "2px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    lineHeight: 1
  },
  name: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#1f2937",
    lineHeight: 1.2,
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  priceContainer: {
    marginLeft: "auto",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-end",
    minWidth: "70px"
  },
  price: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#059669",
    lineHeight: 1
  },
  listPrice: {
    fontSize: "13px",
    color: "#9ca3af",
    textDecoration: "line-through",
    marginTop: "2px"
  }
}

export function ProductRow({ product: baseProduct }: Props) {
  const product = useDecoratedSearchResults<typeof hitDecorators>(baseProduct)

  return (
    <>
      <style>{`
        .product-row {
          transition: background-color 0.15s ease;
        }
        .product-row:hover {
          background-color: #f3f4f6 !important;
        }
      `}</style>
      <AutocompleteElement
        hit={{
          ...product,
          productId: product.productId!,
          url: product.url!
        }}
        as="a"
        componentProps={{
          href: product.url,
          className: "product-row",
          style: styles.container,
          "aria-label": `Product ${product.name}`
        }}
      >
        <img
          src={product.thumbUrl ?? productImagePlaceholder}
          alt={product.name}
          width="44"
          height="44"
          style={styles.image}
        />
        <div data-nosto-element="product" style={styles.content}>
          {product.brand && <div style={styles.brand}>{product.brand}</div>}
          <div style={styles.name}>{product.name}</div>
        </div>
        <div style={styles.priceContainer}>
          {product.price && <span style={styles.price}>{product.priceText}</span>}
          {product.price && product.listPrice && product.listPrice > product.price && (
            <span style={styles.listPrice}>{product.listPriceText}</span>
          )}
        </div>
      </AutocompleteElement>
    </>
  )
}
