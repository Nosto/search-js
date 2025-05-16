import { InputSearchSort } from "@nosto/nosto-js/client"

import { useActions } from "../useActions"
import { useNostoAppState } from "../useNostoAppState"
import { isMatchingSort } from "./utils"

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

  const activeSort =
    sortOptions.find(option => isMatchingSort(option.value.sort, query.products?.sort || []))?.id ?? sortOptions[0]?.id

  const setSort = (sortId: string) => {
    const selectedSort = sortOptions.find(option => option.id === sortId)
    if (selectedSort) {
      updateSearch({
        products: {
          sort: selectedSort.value.sort
        }
      })
    }
  }

  return {
    /** Active sort */
    activeSort,
    /** Set sort function */
    setSort
  }
}
