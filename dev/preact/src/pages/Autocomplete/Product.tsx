import type { SearchProduct } from "@nosto/nosto-js/client"
import { AutocompleteElement } from "@nosto/search-js/preact/autocomplete"
import { useDecoratedSearchResults } from "@nosto/search-js/preact/hooks"

import { productImagePlaceholder } from "../Search/productImagePlaceholder"
import { hitDecorators } from "./Autocomplete"

type Props = {
  product: SearchProduct
}

export function Product({ product: baseProduct }: Props) {
  const product = useDecoratedSearchResults<typeof hitDecorators>(baseProduct)

  return (
    <AutocompleteElement
      hit={{
        ...product,
        productId: product.productId!
      }}
    >
      <a
        href={product.url}
        aria-label={`Product ${product.name}`}
        style={{ display: "grid", gridTemplateColumns: "50px 1fr", gap: 8 }}
      >
        <img
          src={product.thumbUrl ?? productImagePlaceholder}
          alt={product.name}
          width="50"
          height="30"
          style={{
            width: 50,
            height: "auto"
          }}
        />
        <div data-nosto-element="product">
          {product.brand && <div className="ns-color-black ns-mb-1 ns-font-4">{product.brand}</div>}
          <div className="ns-clipped ns-text-four-lines ns-text-md-three-lines ns-mb-2 ns-font-4">{product.name}</div>
          <div aria-label="Price">
            {product.price && <span>{product.priceText}</span>}
            {product.price && product.listPrice && product.listPrice > product.price && (
              <span className="ns-color-black ns-font-4 ns-text-striked ns-ml-2">{product.listPriceText}</span>
            )}
          </div>
        </div>
      </a>
    </AutocompleteElement>
  )
}
