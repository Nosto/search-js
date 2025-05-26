import { SearchFn, SearchOptions } from "@core/types"
import { SearchQuery, SearchResult } from "@nosto/nosto-js/client"

import { getFromCache, setCache } from "./utils/memoryCache"

export async function searchWithMemoryCache(
  query: SearchQuery,
  { track, ...options }: SearchOptions,
  searchFn: SearchFn
): Promise<SearchResult> {
  if (track !== "autocomplete") {
    return searchFn(query, { track, ...options })
  }

  const cacheKey = JSON.stringify(query)
  const cached = getFromCache<SearchResult>(cacheKey)
  if (cached) return cached

  const response = await searchFn(query, { track, ...options })
  setCache(cacheKey, response, 30000) // TTL 30 seconds
  return response
}
