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

  const cacheContextOptions = getCacheResult(usePersistentCache, searchQuery)

  if (cacheContextOptions?.cacheResult) {
    if (!cacheContextOptions?.prefillQuery) {
      return cacheContextOptions.cacheResult
    }
    const backfillResponse = await performSearch(config, options, cacheContextOptions.prefillQuery)
    const mergedResponse = {
      ...cacheContextOptions.cacheResult,
      products: {
        ...cacheContextOptions.cacheResult.products,
        hits: [...(cacheContextOptions.cacheResult.products?.hits || []), ...(backfillResponse.products?.hits || [])],
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

function getCacheResult(
  usePersistentCache: boolean,
  searchQuery: SearchQuery
): CacheContextOptions | undefined {
  const { from, size = 0 } = searchQuery.products || {}

  const cacheData = loadCachedResultIfApplicable(usePersistentCache, searchQuery)

  // no cache data available
  if (!cacheData) {
    return undefined
  }

  const { from: cacheFrom = 0, size: cacheSize = 0 } = cacheData.query.products || {}

  // a regular pagination query
  if (from && from > 0) {
    if (from === cacheFrom && size === cacheSize) {
      return { cacheResult: cacheData.result }
    }
    return undefined
  }

  // cache size matches the requested size
  // works for the first loaded result with all render modes (from = 0, size = DEFAULT_SIZE)
  if (size === cacheSize) {
    return { cacheResult: cacheData.result }
  }

  // requested size is more than the cache size. So, use cache data for prefilling
  const prefillFrom = size - cacheSize
  const prefillSize = size - prefillFrom

  return {
    cacheResult: cacheData.result,
    prefillQuery:
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
