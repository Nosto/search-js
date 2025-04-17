import type { SearchProduct } from "@nosto/nosto-js/client"
import { useDecoratedSearchResults } from "@nosto/search-js/preact/hooks"
import { SerpElement } from "@nosto/search-js/preact/serp"

import { productImagePlaceholder } from "./productImagePlaceholder"
import { hitDecorators } from "./Search"

type Props = {
  product: SearchProduct
}

export function Product({ product: baseProduct }: Props) {
  const product = useDecoratedSearchResults<typeof hitDecorators>(baseProduct)
  const tags = [
    product.onDiscount
      ? {
          label: "Sale",
          class: "ns-badge ns-badge-green-outline ns-d-inline-block ns-text-align-center"
        }
      : undefined
  ].filter(v => !!v)

  return (
    <SerpElement
      hit={{
        ...product,
        productId: product.productId!
      }}
    >
      <a
        href={product.url}
        aria-label={`Product ${product.name}`}
        className="ns-product ns-border-box ns-clickable ns-text-undecorated ns-color-inherit ns-col-12 ns-col-xs-6 ns-col-l-4 ns-p-2 ns-my-2 ns-mx-0"
      >
        <img
          className="ns-w-100 ns-h-auto"
          src={product.imageUrl ?? productImagePlaceholder}
          alt={product.name}
          width="600"
          height="400"
          style={{
            width: 300,
            height: "auto"
          }}
        />
        <div className="ns-relative ns-mt-2" data-nosto-element="product">
          {tags.length > 0 && (
            <div className="ns-tags ns-absolute ns-mb-1">
              {tags.map(v => (
                <span key={v.label} className={v.class}>
                  {v.label}
                </span>
              ))}
            </div>
          )}
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
    </SerpElement>
  )
}
