import { search } from "@core/search"
import { SearchOptions } from "@core/types"
import { SearchQuery } from "@nosto/nosto-js/client"
import { Config } from "@preact/config/config"

import { cacheSearchResult, loadCachedResultIfApplicable } from "./resultCaching"

export async function searchWithCache(config: Config, searchQuery: SearchQuery, options: SearchOptions) {
  const usePersistentCache = config.pageType !== "autocomplete" && config.persistentSearchCache

  const response = usePersistentCache
    ? await getSearchResultWithCache(searchQuery, options, usePersistentCache)
    : await search(searchQuery, options)
  cacheSearchResult(usePersistentCache, searchQuery, response)
  return response
}

async function getSearchResultWithCache(searchQuery: SearchQuery, options: SearchOptions, usePersistentCache: boolean) {
  const { from = 0, size = 0 } = searchQuery.products || {}
  const { result, query } = loadCachedResultIfApplicable(usePersistentCache, searchQuery) || {}
  const cacheFrom = query?.products?.from || 0
  const cacheHits = result?.products?.hits || []

  if (!result) {
    return await search(searchQuery, options)
  }

  // pagination scenario, when from doesn't match the cache
  if (from !== cacheFrom) {
    return await search(searchQuery, options)
  }

  // when request data (from & size) is already in cache
  if (from === cacheFrom && size === cacheHits.length) {
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

  const backfillResponse = await search(backfillQuery, options)

  return {
    ...result,
    products: {
      ...result.products,
      hits: [...(result.products?.hits || []), ...(backfillResponse.products?.hits || [])],
      total: backfillResponse.products?.total
    }
  }
}
