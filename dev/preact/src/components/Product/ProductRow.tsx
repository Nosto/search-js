import type { SearchProduct } from "@nosto/nosto-js/client"
import { AutocompleteElement } from "@nosto/search-js/preact/autocomplete"
import { useDecoratedSearchResults } from "@nosto/search-js/preact/hooks"

import { hitDecorators } from "../../utils/hitDecorators"
import { productImagePlaceholder } from "../../utils/productImagePlaceholder"
import { productRowStyles, styles } from "./ProductRow.styles"

type Props = {
  product: SearchProduct
  highlighted: boolean
}

export function ProductRow({ product: baseProduct, highlighted }: Props) {
  const product = useDecoratedSearchResults<typeof hitDecorators>(baseProduct)

  const reportProductClick = (product: SearchProduct) => {
    // Product click reporting could be implemented here if needed
    console.log("Product clicked:", product)
  }

  return (
    <>
      <style>{productRowStyles}</style>
      <AutocompleteElement
        hit={{
          ...product,
          productId: product.productId!,
          url: product.url!
        }}
        as="a"
        componentProps={{
          href: product.url,
          onClick: () => reportProductClick(product),
          className: "product-row" + (highlighted ? " highlighted" : ""),
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
