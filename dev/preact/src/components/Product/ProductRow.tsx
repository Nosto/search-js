import type { SearchProduct } from "@nosto/nosto-js/client"
import { AutocompleteElement } from "@nosto/search-js/preact/autocomplete"
import { useDecoratedSearchResults } from "@nosto/search-js/preact/hooks"
import { AutocompleteContext } from "@nosto/search-js/preact/inject"
import { useContext } from "preact/hooks"

import { productRowCSS, productRowStyles } from "../../Component.styles"
import { hitDecorators } from "../../utils/hitDecorators"
import { productImagePlaceholder } from "../../utils/productImagePlaceholder"

type Props = {
  product: SearchProduct
  highlighted: boolean
}

export function ProductRow({ product: baseProduct, highlighted }: Props) {
  const product = useDecoratedSearchResults<typeof hitDecorators>(baseProduct)
  const { reportProductClick } = useContext(AutocompleteContext)

  return (
    <>
      <style>{productRowCSS}</style>
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
          style: productRowStyles.container,
          "aria-label": `Product ${product.name}`
        }}
      >
        <img
          src={product.thumbUrl ?? productImagePlaceholder}
          alt={product.name}
          width="44"
          height="44"
          style={productRowStyles.image}
        />
        <div data-nosto-element="product" style={productRowStyles.content}>
          {product.brand && <div style={productRowStyles.brand}>{product.brand}</div>}
          <div style={productRowStyles.name}>{product.name}</div>
        </div>
        <div style={productRowStyles.priceContainer}>
          {product.price && <span style={productRowStyles.price}>{product.priceText}</span>}
          {product.price && product.listPrice && product.listPrice > product.price && (
            <span style={productRowStyles.listPrice}>{product.listPriceText}</span>
          )}
        </div>
      </AutocompleteElement>
    </>
  )
}
