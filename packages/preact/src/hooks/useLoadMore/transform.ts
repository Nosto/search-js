import type { SearchQuery, SearchResult } from "@nosto/nosto-js/client"

import transformSearchQuery from "./transformSearchQuery"
import transformSearchResult from "./transformSearchResult"

export type PageSearchQueryProps = {
  from: number
  size: number
  pageSize: number
}

export type TransformerResult = ReturnType<typeof transform>

export type Transformer = (searchQuery: SearchQuery, newResult: SearchResult) => TransformerResult

export type TransformerProps = {
  searchQuery: SearchQuery
  newResult: SearchResult
  previousResult: SearchResult
  pageSearchQueryProps: PageSearchQueryProps
}

export default function transform({ searchQuery, newResult, previousResult, pageSearchQueryProps }: TransformerProps) {
  return {
    transformedQuery: transformSearchQuery(searchQuery, pageSearchQueryProps),
    transformedResult: transformSearchResult(newResult, previousResult)
  }
}
