import { SearchKeyword, SearchProduct } from "@nosto/nosto-js/client"

import { ProductRow } from "../../../components/Product/ProductRow"
import { AutocompleteKeyword } from "./AutocompleteKeyword"

export function AutocompleteResults({
  loading,
  hits,
  keywords,
  initialized
}: {
  loading: boolean
  hits: SearchProduct[]
  keywords: SearchKeyword[]
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
      {keywords.map(keyword => (
        <AutocompleteKeyword key={keyword.keyword} keyword={keyword} />
      ))}
      {hits.map(hit => (
        <ProductRow key={hit.productId} product={hit} />
      ))}
    </div>
  )
}
