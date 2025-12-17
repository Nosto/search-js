import { InputSearchSort } from "@nosto/nosto-js/client"
import { useCallback } from "preact/hooks"

import { useActions } from "../useActions"
import { useNostoAppState } from "../useNostoAppState"
import { getActiveSortId } from "./utils"

export interface SortOption {
  id: string
  value: {
    name: string
    sort: InputSearchSort[]
  }
}

/**
 * Preact hook that import sort state to the component.
 * @param sortOptions
 * @example
 * ```jsx
 * import { useSort } from '@nosto/search-js/preact/hooks'
 * import { sortOptions } from '../config'
 *
 * export default () => {
 *    const { activeSort, setSort } = useSort(sortOptions)
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
export function useSort(sortOptions: SortOption[]) {
  const query = useNostoAppState(state => state.query)
  const { updateSearch } = useActions()

  const activeSort = getActiveSortId(sortOptions, query.products?.sort || [])

  const setSort = useCallback(
    (sortId: string) => {
      if (sortId === activeSort) {
        return
      }
      const selectedSort = sortOptions.find(option => option.id === sortId)
      if (selectedSort) {
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
