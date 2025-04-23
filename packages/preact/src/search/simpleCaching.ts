import type { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { isEqual } from "@utils/isEqual"
import { getSessionStorageItem, setSessionStorageItem } from "@utils/storage"
import { getCacheKey, isValueShapeCorrect, SearchResultDto, STORAGE_ENTRY_NAME } from "./resultCaching"

export function cacheResult(usePersistentCache: boolean, query: SearchQuery, result: SearchResult) {
  if (!usePersistentCache) {
    return
  }

  const dto: SearchResultDto = { query, result }
  setSessionStorageItem(STORAGE_ENTRY_NAME, dto)
}

export function loadResultFromCache(usePersistentCache: boolean, query: SearchQuery): SearchResult | null {
  if (!usePersistentCache) {
    return null
  }

  const storageValue = getSessionStorageItem(STORAGE_ENTRY_NAME)
  if (!storageValue || !isValueShapeCorrect(storageValue)) {
    return null
  }

  const cachedQuery = getCacheKey(storageValue.query)
  if (!isEqual(getCacheKey(query), cachedQuery)) {
    return null
  }
  return storageValue.result
}