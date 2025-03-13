import type { SearchProduct } from "@nosto/nosto-js/client"
import { SerpElement, useDecoratedSearchResults } from "@nosto/search-js/preact"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

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
        style={{ width: 300, flexShrink: 0, display: "block" }}
      >
        <Card style={{ gap: 16 }}>
          <div style={{ width: "100%", height: 200, display: "flex", justifyContent: "center" }}>
            <img src={product.imageUrl ?? productImagePlaceholder} alt={product.name} style={{ height: "100%" }} />
          </div>
          <Separator />
          <div data-nosto-element="product">
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
            <Separator />
            <div aria-label="Price">
              {product.price && <span>{product.priceText}</span>}
              &nbsp;
              {product.price && product.listPrice && product.listPrice > product.price && (
                <span style={{ color: "gray", textDecoration: "line-through" }}>{product.listPriceText}</span>
              )}
            </div>
          </div>
        </Card>
      </a>
    </SerpElement>
  )
}
