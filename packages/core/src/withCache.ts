import { SearchFn, SearchOptions } from "@core/types"
import { SearchQuery, SearchResult } from "@nosto/nosto-js/client"

import { cacheSearchResult, loadCachedResult } from "./resultCaching"

export async function searchWithCache(
  query: SearchQuery,
  { usePersistentCache, ...options }: SearchOptions,
  searchFn: SearchFn
): Promise<SearchResult> {
  if (!usePersistentCache) {
    return searchFn(query, options)
  }
  const response = await getSearchResultWithCache(query, options, searchFn)
  cacheSearchResult(query, response)
  return response
}

async function getSearchResultWithCache(
  searchQuery: SearchQuery,
  options: SearchOptions,
  searchFn: SearchFn
): Promise<SearchResult> {
  const { from = 0, size = 0 } = searchQuery.products || {}
  const result = loadCachedResult(searchQuery)
  if (!result) {
    return await searchFn(searchQuery, options)
  }

  const cacheHits = result?.products?.hits || []

  // when request data is already in cache
  if (size === cacheHits.length) {
    return result
  }

  // requested size is less than the cache size
  if (size < cacheHits.length) {
    return {
      ...result,
      products: {
        ...result.products,
        hits: cacheHits.slice(0, size),
        total: result.products?.total || 0
      }
    }
  }

  // requested size is more than the cache size. So, use cache data for prefilling
  const backfillSize = size - cacheHits.length

  // for pagination scenario, use the from value from the request
  const backfillFrom = from > 0 ? from + 1 : size - backfillSize
  const backfillQuery = {
    ...searchQuery,
    products: {
      ...searchQuery.products,
      from: backfillFrom,
      size: backfillSize
    }
  }

  const backfillResponse = await searchFn(backfillQuery, options)

  return {
    ...result,
    products: {
      ...result.products,
      hits: [...(result.products?.hits || []), ...(backfillResponse.products?.hits || [])],
      total: backfillResponse.products?.total || 0
    }
  }
}
