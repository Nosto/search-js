import { SearchKeyword, SearchProduct } from "@nosto/nosto-js/client"
import { useNostoAppState } from "@nosto/search-js/preact/hooks"

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
  const highlightIndex = useNostoAppState(state => state.highlightIndex ?? -1)

  if (!initialized) {
    return <div>Start typing to search</div>
  }

  if (loading) {
    return <div>Loading...</div>
  }

  let currentIndex = 0

  return (
    <div>
      {keywords.map(keyword => (
        <AutocompleteKeyword key={keyword.keyword} keyword={keyword} highlighted={currentIndex++ === highlightIndex} />
      ))}
      {hits.map(hit => (
        <ProductRow key={hit.productId} product={hit} highlighted={currentIndex++ === highlightIndex} />
      ))}
    </div>
  )
}
