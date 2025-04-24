import { search } from "@core/search"
import { HitDecorator, SearchOptions } from "@core/types"
import { SearchQuery, SearchResult } from "@nosto/nosto-js/client"

import { cacheSearchResult, loadCachedResult, SearchResultDto } from "./resultCaching"

export async function searchWithCache<HD extends readonly HitDecorator[]>(
  query: SearchQuery,
  usePersistentCache: boolean,
  options: SearchOptions<HD> = {}
) {
  if (usePersistentCache) {
    const cached = loadCachedResult(query)
    if (cached) {
      if (query.products?.size == cached.query.products?.size) {
        return cached.result
      } else if ((cached.query.products?.size ?? 0) < (query.products?.size ?? 0)) {
        const fullResult = await toFullResult<HD>(query, cached, options)
        cacheSearchResult(query, fullResult as SearchResult)
        return fullResult
      }
    }
  }
  const result = await search<HD>(query, options)
  if (usePersistentCache) {
    cacheSearchResult(query, result as SearchResult)
  }
  return result
}

async function toFullResult<HD extends readonly HitDecorator[]>(
  query: SearchQuery,
  cached: SearchResultDto,
  options: SearchOptions<HD>
) {
  const newFrom = (query.products?.from ?? 0) + (cached.query.products?.size ?? 0)
  const newSize = (query.products?.size ?? 0) - (cached.query.products?.size ?? 0)
  const newQuery = {
    ...query,
    products: {
      ...query.products,
      from: newFrom,
      size: newSize
    }
  }
  const extraResult = await search<HD>(newQuery, options)
  return {
    ...extraResult,
    products: {
      ...extraResult.products,
      hits: [...(cached.result.products?.hits ?? []), ...extraResult.products?.hits]
    }
  }
}
