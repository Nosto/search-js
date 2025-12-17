import { getSessionStorageItem, setSessionStorageItem } from "@utils/storage"
import { useCallback, useEffect, useState } from "preact/hooks"

import { useActions } from "../useActions"
import { useNostoAppState } from "../useNostoAppState"
import { SortOption } from "./useSort"
import { isMatchingSort } from "./utils"

const sortStorageKey = "nosto:search-js:sort"

/**
 * Preact hook that imports the sort state to the component and persists it in session storage.
 * This hook extends useSort functionality by maintaining the sort selection across page reloads
 * within the same session.
 * @param sortOptions
 * @example
 * ```jsx
 * import { useSortWithSessionStorage } from '@nosto/search-js/preact/hooks'
 * import { sortOptions } from '../config'
 *
 * export default () => {
 *    const { activeSort, setSort } = useSortWithSessionStorage(sortOptions)
 *
 *    const handleSortChange = (event) => {
 *        setSort(event.target.value)
 *    }
 *
 *    return (
 *        <div>
 *            <select
 *                value={activeSort}
 *                onChange={e => setSort(e.target.value)}
 *            >
 *                {sortOptions.map(option => (
 *                    <option key={option.id} value={option.id}>
 *                        {option.value.name}
 *                    </option>
 *                ))}
 *            </select>
 *        </div>
 *    )
 * }
 * ```
 * @group Hooks
 */
export function useSortWithSessionStorage(sortOptions: SortOption[]) {
  const query = useNostoAppState(state => state.query)
  const { updateSearch } = useActions()
  const [isInitialized, setIsInitialized] = useState(false)

  // Get the current active sort from query state
  const activeSort =
    sortOptions.find(option => isMatchingSort(option.value.sort, query.products?.sort || []))?.id ?? sortOptions[0]?.id

  // Load sort from session storage on mount and apply it
  useEffect(() => {
    if (!isInitialized) {
      const storedSortId = getSessionStorageItem<string>(sortStorageKey)
      if (storedSortId) {
        const storedOption = sortOptions.find(option => option.id === storedSortId)
        const currentActiveSort =
          sortOptions.find(option => isMatchingSort(option.value.sort, query.products?.sort || []))?.id ??
          sortOptions[0]?.id
        if (storedOption && storedOption.id !== currentActiveSort) {
          updateSearch({
            products: {
              sort: storedOption.value.sort
            }
          })
        }
      }
      setIsInitialized(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized])

  const setSort = useCallback(
    (sortId: string) => {
      if (sortId === activeSort) {
        return
      }
      const selectedSort = sortOptions.find(option => option.id === sortId)
      if (selectedSort) {
        setSessionStorageItem(sortStorageKey, sortId)
        updateSearch({
          products: {
            sort: selectedSort.value.sort
          }
        })
      }
    },
    [sortOptions, updateSearch, activeSort]
  )

  return {
    /** Active sort */
    activeSort,
    /** Set sort function */
    setSort
  }
}
