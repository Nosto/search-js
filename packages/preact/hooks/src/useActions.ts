import type { InputSearchRangeFilter, SearchOptions, SearchQuery } from "@nosto/nosto-js/client"
import { useConfig } from "@preact/common/config/configContext"
import { StoreContext } from "@preact/common/store/storeContext"
import { useCallback, useContext, useMemo } from "preact/hooks"

import { newSearch } from "../../common/src/actions/newSearch"
import { removeAllFilters } from "../../common/src/actions/removeAllFilters"
import { replaceFilter } from "../../common/src/actions/replaceFilter"
import { toggleProductFilter } from "../../common/src/actions/toggleProductFilter"
import { updateSearch } from "../../common/src/actions/updateSearch"

/**
 * Preact hook that import current actions to the component.
 * Actions should be used to modify state, making new searches, etc.
 *
 * @example
 * ```jsx
 * import { useActions } from '@nosto/search-js/preact/hooks'
 *
 * export default () => {
 *     const { newSearch } = useActions()
 *
 *     return <button onClick={() => {
 *         newSearch({
 *             query: {
 *                 query: "shoes"
 *             }
 *         })
 *     }}>
 *         Search for "shoes"
 *     </button>
 * }
 * ```
 *
 * @group Hooks
 */
export function useActions() {
  const config = useConfig()
  const store = useContext(StoreContext)
  const context = useMemo(
    () => ({
      config,
      store
    }),
    [config, store]
  )

  const newSearchCallback = useCallback(
    (query: SearchQuery, options?: SearchOptions) => {
      return newSearch(context, query, options)
    },
    [context]
  )

  const updateSearchCallback = useCallback(
    (query: SearchQuery, options?: SearchOptions) => {
      return updateSearch(context, query, options)
    },
    [context]
  )

  const toggleProductFilterCallback = useCallback(
    (field: string, value: string, active: boolean) => {
      return toggleProductFilter(context, field, value, active)
    },
    [context]
  )

  const replaceFilterCallback = useCallback(
    (field: string, value: InputSearchRangeFilter | string | undefined) => {
      return replaceFilter(context, field, value)
    },
    [context]
  )

  const removeAllFiltersCallback = useCallback(() => {
    return removeAllFilters(context)
  }, [context])

  return {
    newSearch: newSearchCallback,
    updateSearch: updateSearchCallback,
    toggleProductFilter: toggleProductFilterCallback,
    replaceFilter: replaceFilterCallback,
    removeAllFilters: removeAllFiltersCallback
  }
}
