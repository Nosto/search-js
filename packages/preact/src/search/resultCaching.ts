import type { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { isEqual } from "@utils/isEqual"
import { getSessionStorageItem, setSessionStorageItem } from "@utils/storage"

export const STORAGE_ENTRY_NAME = "nosto:search:searchResult"

export type SearchResultDto = {
  query: ReturnType<typeof getCacheKey>
  result: SearchResult
}

export function cacheSearchResult(query: SearchQuery, result: SearchResult) {
  const dto: SearchResultDto = { query, result }
  setSessionStorageItem(STORAGE_ENTRY_NAME, dto)
}

export function loadCachedResult(query: SearchQuery) {
  const storageValue = getSessionStorageItem(STORAGE_ENTRY_NAME)
  if (!storageValue || !isValueShapeCorrect(storageValue)) {
    return null
  }

  const cachedQuery = getCacheKey(storageValue.query, false)
  if (!isEqual(getCacheKey(query, true), cachedQuery)) {
    return null
  }
  return storageValue
}

function getCacheKey(query: SearchQuery, normalize: boolean) {
  const key = {
    ...query,
    products: {
      ...query.products,
      size: 0 // size is cleared to allow for infinite scrolling
    },
    time: 0
  }
  return normalize ? JSON.parse(JSON.stringify(key)) : key
}

// TODO: Better validation with valibot
function isValueShapeCorrect(value: unknown): value is SearchResultDto {
  return typeof value === "object" && value !== null && "query" in value && "result" in value
}
