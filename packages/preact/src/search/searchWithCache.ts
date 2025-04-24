import { search } from "@core/search"
import { SearchOptions } from "@core/types"
import { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { Config } from "@preact/config/config"
import { deepMerge } from "@utils/deepMerge"

import { applyQueryDefaults } from "./defaults"
import { cacheSearchResult, loadCachedResultIfApplicable } from "./resultCaching"

type CacheContextOptions = {
  cacheResult?: SearchResult
  prefillQuery?: SearchQuery
}

export async function searchWithCache(config: Config, searchQuery: SearchQuery, options: SearchOptions) {
  const usePersistentCache = config.pageType !== "autocomplete" && config.persistentSearchCache

  const { cacheResult, prefillQuery } = getCacheResult(usePersistentCache, searchQuery) || {}

  if (cacheResult) {
    if (!prefillQuery) {
      return cacheResult
    }
    const backfillResponse = await performSearch(config, options, prefillQuery)
    const mergedResponse = {
      ...cacheResult,
      products: {
        ...cacheResult.products,
        hits: [...(cacheResult.products?.hits || []), ...(backfillResponse.products?.hits || [])],
        total: backfillResponse.products?.total
      }
    }
    cacheSearchResult(usePersistentCache, searchQuery, mergedResponse)
    return mergedResponse
  }

  const response = await performSearch(config, options, searchQuery)
  cacheSearchResult(usePersistentCache, searchQuery, response)
  return response
}

function getCacheResult(usePersistentCache: boolean, searchQuery: SearchQuery): CacheContextOptions | undefined {
  const { from, size = 0 } = searchQuery.products || {}

  const cacheData = loadCachedResultIfApplicable(usePersistentCache, searchQuery)

  // no cache data available
  if (!cacheData) {
    return undefined
  }

  const { from: cacheFrom = 0, size: cacheSize = 0 } = cacheData.query.products || {}

  // cache size matches the requested size
  if (size === cacheSize) {
    // a regular pagination query
    if (from && from > 0 && from !== cacheFrom) {
      return undefined
    }
    return { cacheResult: cacheData.result }
  }

  // requested size is more than the cache size. So, use cache data for prefilling
  const prefillFrom = size - cacheSize
  const prefillSize = size - prefillFrom

  const prefillQuery =
    prefillFrom > 0
      ? {
          ...searchQuery,
          products: {
            ...searchQuery.products,
            from: prefillFrom,
            size: prefillSize
          }
        }
      : undefined

  return {
    cacheResult: cacheData.result,
    prefillQuery
  }
}

async function performSearch(config: Config, options: SearchOptions, query: SearchQuery) {
  const queryWithDefaults = applyQueryDefaults(config.pageType, query)
  const mergedConfig = deepMerge(search, options, {
    track: config.pageType,
    redirect: config.pageType !== "autocomplete",
    isKeyword: !!options?.isKeyword
  })
  return await search(queryWithDefaults, mergedConfig)
}
