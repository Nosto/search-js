import { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { isEqual } from "@utils/isEqual"
import { getSessionStorageItem, setSessionStorageItem } from "@utils/storage"

export const STORAGE_ENTRY_NAME = "nosto:search-js:cache"

const TTL = 60 * 1000 // 1 minute

type CacheEntry = {
  query: SearchQuery
  result: SearchResult
  created: number
}

export function cacheSearchResult(query: SearchQuery, result: SearchResult) {
  setSessionStorageItem(STORAGE_ENTRY_NAME, { query, result, created: Date.now() })
}

export function loadCachedResult(query: SearchQuery) {
  const storageValue = getSessionStorageItem<CacheEntry>(STORAGE_ENTRY_NAME)
  if (!storageValue || !isValueShapeCorrect(storageValue)) {
    return null
  }

  const cachedQuery = getCacheKey(storageValue.query)
  if (!isEqual(getCacheKey(query), cachedQuery)) {
    return null
  }
  if (Date.now() - storageValue.created > TTL) {
    return null
  }

  return storageValue.result
}

// This function is used to create a cache key for the search query.
// It removes the time and size properties from the query object.
function getCacheKey(query: SearchQuery): SearchQuery {
  const params = {
    ...query,
    time: undefined,
    products: {
      ...query.products,
      size: undefined
    }
  }

  return JSON.parse(JSON.stringify(params))
}

// TODO: Better validation with valibot
function isValueShapeCorrect(value: unknown): value is CacheEntry {
  return typeof value === "object" && value !== null && "query" in value && "result" in value && "created" in value
}
