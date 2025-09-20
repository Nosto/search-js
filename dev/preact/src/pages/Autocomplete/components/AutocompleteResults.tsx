import { SearchKeyword, SearchProduct } from "@nosto/nosto-js/client"

import { ProductRow } from "../../../components/Product/ProductRow"
import { AutocompleteKeyword } from "./AutocompleteKeyword"

export function AutocompleteResults({
  loading,
  hits,
  keywords,
  initialized,
  highlightedElementIndex = -1
}: {
  loading: boolean
  hits: SearchProduct[]
  keywords: SearchKeyword[]
  initialized: boolean
  highlightedElementIndex?: number
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
      {hits.map((hit, index) => (
        <ProductRow
          key={hit.productId}
          product={hit}
          highlighted={index + keywords.length === highlightedElementIndex}
        />
      ))}
    </div>
  )
}
