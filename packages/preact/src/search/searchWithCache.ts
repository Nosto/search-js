import { search } from "@core/search"
import { SearchOptions } from "@core/types"
import { SearchQuery } from "@nosto/nosto-js/client"
import { Config } from "@preact/config/config"
import { deepMerge } from "@utils/deepMerge"

import { cacheSearchResult, loadCachedResultIfApplicable } from "./resultCaching"

export async function searchWithCache(config: Config, searchQuery: SearchQuery, options: SearchOptions) {
  const usePersistentCache = config.pageType !== "autocomplete" && config.persistentSearchCache

  const response = usePersistentCache
    ? await getSearchResultWithCache(searchQuery, config, options)
    : await performSearch(config, options, searchQuery)
  cacheSearchResult(usePersistentCache, searchQuery, response)
  return response
}

async function getSearchResultWithCache(searchQuery: SearchQuery, config: Config, options: SearchOptions) {
  const { from = 0, size = 0 } = searchQuery.products || {}
  const usePersistentCache = config.pageType !== "autocomplete" && config.persistentSearchCache
  const { result, query } = loadCachedResultIfApplicable(usePersistentCache, searchQuery) || {}
  const cacheFrom = query?.products?.from || 0
  const cacheHits = result?.products?.hits || []

  if (!result) {
    return await performSearch(config, options, searchQuery)
  }

  if (from > 0) {
    return from === cacheFrom ? result : await performSearch(config, options, searchQuery)
  }

  if (size === cacheHits.length) {
    return result
  }

  // requested size is more than the cache size. So, use cache data for prefilling
  const backfillSize = size - cacheHits.length
  const backfillFrom = size - backfillSize
  const backfillQuery = {
    ...searchQuery,
    products: {
      ...searchQuery.products,
      from: backfillFrom,
      size: backfillSize
    }
  }

  const backfillResponse = await performSearch(config, options, backfillQuery)

  return {
    ...result,
    products: {
      ...result.products,
      hits: [...(result.products?.hits || []), ...(backfillResponse.products?.hits || [])],
      total: backfillResponse.products?.total
    }
  }
}

async function performSearch(config: Config, options: SearchOptions, query: SearchQuery) {
  const mergedConfig = deepMerge(search, options, {
    track: config.pageType,
    redirect: config.pageType !== "autocomplete",
    isKeyword: !!options?.isKeyword
  })
  return await search(query, mergedConfig)
}
