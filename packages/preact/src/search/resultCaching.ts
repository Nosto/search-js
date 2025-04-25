import { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { isEqual } from "@utils/isEqual"
import { omitUndefined } from "@utils/omitUndefined"
import { getSessionStorageItem, setSessionStorageItem } from "@utils/storage"

export const STORAGE_ENTRY_NAME = "nosto:search:searchResult"

export type SearchResultDto = {
  query: ReturnType<typeof getCacheKey>
  result: SearchResult
}

export function loadCachedResultIfApplicable(usePersistentCache: boolean, query: SearchQuery) {
  if (!usePersistentCache) {
    return null
  }

  const storageValue = getSessionStorageItem<SearchResultDto>(STORAGE_ENTRY_NAME)
  if (!storageValue) {
    return null
  }

  const cachedQuery = getCacheKey(storageValue.query)
  if (!isEqual(getCacheKey(query), cachedQuery)) {
    return null
  }
  return storageValue
}

export function cacheSearchResult(usePersistentCache: boolean, query: SearchQuery, result: SearchResult) {
  if (!usePersistentCache) {
    return
  }

  const dto: SearchResultDto = { query, result }
  setSessionStorageItem(STORAGE_ENTRY_NAME, dto)
}

// This function is used to create a cache key for the search query.
// It removes the time and size properties from the query object.
function getCacheKey(query: SearchQuery): SearchQuery {
  const params = {
    ...query,
    time: undefined,
    products: {
      ...query.products,
      from: query.products?.from || 0,
      size: undefined
    }
  }

  return omitUndefined(params)
}

// TODO: Better validation with valibot
export function isValueShapeCorrect(value: unknown): value is SearchResultDto {
  return typeof value === "object" && value !== null && "query" in value && "result" in value
}
