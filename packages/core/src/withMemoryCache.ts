import { SearchFn, SearchOptions } from "@core/types"
import { SearchQuery, SearchResult } from "@nosto/nosto-js/client"

import { getFromCache, setCache } from "./utils/memoryCache"

export async function searchWithMemoryCache(
  query: SearchQuery,
  { track, ...options }: SearchOptions,
  searchFn: SearchFn
): Promise<SearchResult> {
  // For autocomplete only
  if (track !== "autocomplete") {
    return searchFn(query, { track, ...options })
  }

  const queryKey = typeof query.query === "string" ? query.query.trim().toLowerCase() : ""
  const cacheKey = `autocomplete:${queryKey}`
  const cached = getFromCache<SearchResult>(cacheKey)
  if (cached) return cached

  const response = await searchFn(query, { track, ...options })
  setCache(cacheKey, response, 30000) // TTL 30 seconds
  return response
}
