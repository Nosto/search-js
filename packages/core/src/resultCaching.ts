import { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { isEqual } from "@utils/isEqual"
import { getSessionStorageItem, setSessionStorageItem } from "@utils/storage"

export const STORAGE_ENTRY_NAME = "nosto:search:searchResult"

export type SearchResultDto = {
  query: SearchQuery
  result: SearchResult
}

export function cacheSearchResult(query: SearchQuery, result: SearchResult) {
  const dto: SearchResultDto = { query, result }
  setSessionStorageItem(STORAGE_ENTRY_NAME, dto)
}

export function loadCachedResult(query: SearchQuery) {
  const storageValue = getSessionStorageItem<SearchResultDto>(STORAGE_ENTRY_NAME)
  if (!storageValue || !isValueShapeCorrect(storageValue)) {
    return null
  }

  const cachedQuery = getCacheKey(storageValue.query)
  if (!isEqual(getCacheKey(query), cachedQuery)) {
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
export function isValueShapeCorrect(value: unknown): value is SearchResultDto {
  return typeof value === "object" && value !== null && "query" in value && "result" in value
}
