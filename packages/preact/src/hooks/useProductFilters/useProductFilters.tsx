import { useCallback, useMemo } from "preact/hooks"

import { useActions } from "../useActions"
import { useNostoAppState } from "../useNostoAppState"
import { useProductFiltersUtils } from "./useProductFiltersUtils"

/**
 * Preact hook that imports the product filters to the component.
 *
 * @example
 * ```jsx
 * import { useProductFilters, useActions } from '@nosto/search-js/preact/hooks'
 *
 * export default () => {
 *     const { filters } = useProductFilters()
 *     const { toggleProductFilter } = useActions()
 *
 *     return filters.map((filter) => <li>
 *         <button
 *              title="Remove Filter"
 *              onClick={(e) => {
 *                  e.preventDefault()
 *                  toggleProductFilter(
 *                      filter.field,
 *                      filter.value,
 *                      false
 *                  )
 *              }}
 *          >
 *             {filter.filter}: {filter.value}{' '}
 *             <span>&#10005;</span>
 *          </button>
 *     </li>)
 * }
 * ```
 *
 * @group Hooks
 */
export function useProductFilters() {
  const { filter } = useNostoAppState(state => ({
    filter: state.query.products?.filter ?? []
  }))
  const { updateSearch } = useActions()
  const { selectFilters, toValueFilter, toRangeFilter } = useProductFiltersUtils()

  const filters = useMemo(() => {
    if (!filter) {
      return []
    }

    return filter
      .filter(selectFilters)
      .flatMap(filter => {
        if ("value" in filter) {
          return toValueFilter(filter)
        }

        if ("range" in filter) {
          return toRangeFilter(filter)
        }

        return []
      })
      .filter(Boolean)
  }, [filter, selectFilters, toRangeFilter, toValueFilter])

  const removeAll = useCallback(() => {
    updateSearch({
      products: {
        filter: []
      }
    })
  }, [updateSearch])

  return {
    /** Selected filters array. */
    filters,
    /** Should remove all selected filters. */
    removeAll
  }
}
