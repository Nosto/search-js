import type { SearchProduct, SearchProductSku } from "@nosto/nosto-js/client"
import { useDecoratedSearchResults, useSwatches } from "@nosto/search-js/preact/hooks"
import { SerpElement } from "@nosto/search-js/preact/serp"

import { productImagePlaceholder } from "./productImagePlaceholder"
import ProductSwatches from "./ProductSwatches"
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
        "aria-label": `Product ${product.name}`
      }}
    >
      <img
        className="ns-w-100 ns-h-auto"
        src={product.imageUrl ?? previewImage}
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
      {product.brand && <div className="ns-color-black ns-mb-1 ns-font-4">{product.brand}</div>}
      <div className="ns-clipped ns-text-four-lines ns-text-md-three-lines ns-mb-2 ns-font-4">{product.name}</div>
      <div aria-label="Price">
        {product.price && <span>{product.priceText}</span>}
        {product.price && product.listPrice && product.listPrice > product.price && (
          <span className="ns-color-black ns-font-4 ns-text-striked ns-ml-2">{product.listPriceText}</span>
        )}
      </div>
      <div>
        {" "}
        <ProductSwatches swatches={swatches} toggleOption={toggleOption} />
        {matchedSkus.length === 1 && <button onClick={() => handleAddToCart(skuToAdd)}>Add to Cart</button>}
      </div>
    </SerpElement>
  )
}
