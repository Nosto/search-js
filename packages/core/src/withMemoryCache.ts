import { SearchFn, SearchOptions } from "@core/types"
import { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { isEqual } from "@utils/isEqual"

type CacheEntry = {
  query: SearchQuery
  result: SearchResult
  created: number
}

const TTL = 30000
const cache = new Map<string, CacheEntry>()

function getFromCache(key: string, currentQuery: SearchQuery) {
  const entry = cache.get(key)
  if (!entry) return undefined

  const isExpired = Date.now() - entry.created > TTL
  const sameQuery = isEqual(currentQuery, entry.query)

  if (isExpired || !sameQuery) {
    cache.delete(key)
    return undefined
  }

  return entry.result
}

function setCache(key: string, query: SearchQuery, result: SearchResult) {
  cache.set(key, {
    query,
    result,
    created: Date.now()
  })
}

export function clearMemoryCache() {
  cache.clear()
}

export async function autocompleteWithMemoryCache(query: SearchQuery, options: SearchOptions, searchFn: SearchFn) {
  if (!options.useAutocompleteMemoryCache) {
    return searchFn(query, options)
  }

  const cacheKey = `${JSON.stringify(query)}`
  const cached = getFromCache(cacheKey, query)
  if (cached) return cached

  const result = await searchFn(query, options)
  setCache(cacheKey, query, result)
  return result
}
