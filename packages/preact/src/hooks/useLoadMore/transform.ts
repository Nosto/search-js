import type { SearchQuery, SearchResult } from "@nosto/nosto-js/client"

import transformSearchQuery, { TransformSearchQueryProps } from "./transformSearchQuery"
import transformSearchResult, { TransformSearchResultProps } from "./transformSearchResult"

export type PageSearchQueryProps = {
  from: number
  size: number
  pageSize: number
}

export type Transformer = (searchQuery: SearchQuery, newResult: SearchResult) => TransformResult

type TransformerProps = {
  query?: TransformSearchQueryProps
  result?: TransformSearchResultProps
}

type TransformResult = {
  transformedQuery?: ReturnType<typeof transformSearchQuery>
  transformedResult?: ReturnType<typeof transformSearchResult>
}

export function transform<T extends TransformerProps>({ query, result }: T): TransformResult {
  return {
    ...(query && { transformedQuery: transformSearchQuery(query) }),
    ...(result && { transformedResult: transformSearchResult(result) })
  }
}
