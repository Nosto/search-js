import type { InputSearchRangeFilter, SearchOptions, SearchQuery } from "@nosto/nosto-js/client"
import { useConfig } from "@preact/config/configContext"
import { StoreContext } from "@preact/storeContext"
import { useCallback, useContext, useMemo } from "preact/hooks"

import { newSearch } from "../actions/newSearch"
import { replaceFilter } from "../actions/replaceFilter"
import { toggleProductFilter } from "../actions/toggleProductFilter"
import { updateSearch } from "../actions/updateSearch"
import { SearchResultTransformer } from "./useLoadMore/transformSearchResult"

/**
 * Preact hook that import current actions to the component.
 * Actions should be used to modify state, making new searches, etc.
 *
 * @example
 * ```jsx
 * import { useActions } from '@nosto/search-js/preact'
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
      return newSearch({ context, query, options })
    },
    [context]
  )

  const updateSearchCallback = useCallback(
    (query: SearchQuery, options?: SearchOptions, transformer?: SearchResultTransformer) => {
      return updateSearch({ context, query, options, transformer })
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

  return {
    newSearch: newSearchCallback,
    updateSearch: updateSearchCallback,
    toggleProductFilter: toggleProductFilterCallback,
    replaceFilter: replaceFilterCallback
  }
}
