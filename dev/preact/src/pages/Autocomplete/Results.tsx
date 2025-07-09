import { SearchProduct } from "@nosto/nosto-js/client"

import { ProductRow } from "../../components/Product/ProductRow"

export function Results({
  loading,
  hits,
  initialized
}: {
  loading: boolean
  hits: SearchProduct[]
  initialized: boolean
}) {
  if (!initialized) {
    return <div>Start typing to search</div>
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {hits.map(hit => (
        <ProductRow key={hit.productId} product={hit} />
      ))}
    </div>
  )
}
