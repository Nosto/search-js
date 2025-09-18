import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from "@utils/storage"
import { useCallback, useMemo } from "preact/hooks"

import { useNostoAppState } from "./useNostoAppState"

const historyKey = "nosto:search-js:history" as const

/**
 * Preact hook that provides search history functionality.
 * Uses localStorage to persist search history and integrates with the Nosto app state.
 *
 * @param historySize Maximum number of history items to keep (default: 10)
 *
 * @example
 * ```jsx
 * import { useSearchHistory } from "@nosto/search-js/preact/hooks"
 *
 * export default function SearchComponent() {
 *   const { historyItems, addToHistory, clearHistory } = useSearchHistory()
 *
 *   const handleSearch = (query: string) => {
 *     addToHistory(query)
 *     // perform search...
 *   }
 *
 *   return (
 *     <div>
 *       {historyItems.map(item => (
 *         <button key={item} onClick={() => handleSearch(item)}>
 *           {item}
 *         </button>
 *       ))}
 *       <button onClick={clearHistory}>Clear History</button>
 *     </div>
 *   )
 * }
 * ```
 *
 * @group Hooks
 */
export function useSearchHistory(historySize = 10) {
  // Get history items from app state if available, otherwise get from localStorage
  const historyItemsFromState = useNostoAppState(state => state.historyItems)

  const historyItems = useMemo(() => {
    if (historyItemsFromState) {
      return historyItemsFromState
    }
    const historyFromLocalStorage = getLocalStorageItem<string[]>(historyKey) ?? []
    return [...historyFromLocalStorage].reverse().filter((item: string) => !!item)
  }, [historyItemsFromState])

  const addToHistory = useCallback(
    (value: string) => {
      if (!value || !value.trim()) {
        return
      }

      const trimmedValue = value.trim()
      const allItems = getLocalStorageItem<string[]>(historyKey) ?? []
      const filteredItems = allItems.filter(v => v !== trimmedValue).slice(historySize ? -historySize : 0)
      filteredItems.push(trimmedValue)
      setLocalStorageItem(historyKey, filteredItems)
    },
    [historySize]
  )

  const clearHistory = useCallback(() => {
    removeLocalStorageItem(historyKey)
  }, [])

  return {
    /** Array of search history items in reverse chronological order */
    historyItems,
    /** Add a search term to the history */
    addToHistory,
    /** Clear all search history */
    clearHistory
  }
}
