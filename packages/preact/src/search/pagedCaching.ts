import type { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { mergeProductHits } from "@preact/hooks/useLoadMore/transformSearchResult"
import { isEqual, isEqualIgnoringFields } from "@utils/isEqual"
import { getSessionStorageItem, setSessionStorageItem } from "@utils/storage"
import { getCacheKey, isValueShapeCorrect, STORAGE_ENTRY_NAME } from "./resultCaching"

type SearchResultDto = {
  query: ReturnType<typeof getCacheKey>
  result: SearchResult
}

const pageQueryFields = ["size", "from"]

export function cachePaginatedResult(usePersistentCache: boolean, query: SearchQuery, result: SearchResult) {
  if (!usePersistentCache) {
    return
  }

  const storageValues = getSessionStorageItem<SearchResultDto[]>(STORAGE_ENTRY_NAME)
  if (storageValues && !storageValues.every(isValueShapeCorrect)) {
    return null
  }

  if (storageValues?.length) {
    const recentValue = storageValues[storageValues.length - 1]

    const linked = isEqualIgnoringFields(getCacheKey(query), getCacheKey(recentValue.query), pageQueryFields)

    if (linked) {
      storageValues.push({ query, result })
      setSessionStorageItem(STORAGE_ENTRY_NAME, storageValues)
    }
  } else {
    setSessionStorageItem(STORAGE_ENTRY_NAME, [{ query, result }])
  }
}

export function loadPaginatedResultFromCache(usePersistentCache: boolean, query: SearchQuery): SearchResult | null {
  if (!usePersistentCache) {
    return null
  }

  const storageValues = getSessionStorageItem<SearchResultDto[]>(STORAGE_ENTRY_NAME)
  if (!storageValues || !storageValues.every(isValueShapeCorrect)) {
    return null
  }

  const recentValue = storageValues[storageValues.length - 1]

  const cachedQuery = getCacheKey(recentValue.query)
  if (!isEqual(getCacheKey(query), cachedQuery)) {
    return null
  }
  return mergeProductHits(...storageValues.map(item => item.result))
}
