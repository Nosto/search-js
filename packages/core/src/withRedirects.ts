import { SearchQuery, SearchResult } from "@nosto/nosto-js/client"

import { SearchFn, SearchOptions } from "./types"

export async function searchWithRedirects(
  query: SearchQuery,
  options: SearchOptions,
  searchFn: SearchFn
): Promise<SearchResult> {
  if (!options.redirect) {
    return searchFn(query, options)
  }
  const response = await searchFn(query, options)
  if (response.keywords?.hits?.length) {
    const match = response.keywords.hits.find(hit => hit.keyword === query.query && hit._redirect)
    if (match && match._redirect) {
      window.location.href = match._redirect
    }
  }
  return response
}
