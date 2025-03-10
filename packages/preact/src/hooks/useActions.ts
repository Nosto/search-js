import type { InputSearchRangeFilter, SearchOptions, SearchQuery } from "@nosto/nosto-js/client"
import { useConfig } from "@preact/config/configContext"
import { StoreContext } from "@preact/storeContext"
import { useContext } from "preact/hooks"

import { newSearch } from "../actions/newSearch"
import { replaceFilter } from "../actions/replaceFilter"
import { toggleProductFilter } from "../actions/toggleProductFilter"
import { updateSearch } from "../actions/updateSearch"

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
  const context = {
    config: useConfig(),
    store: useContext(StoreContext)
  }
  return {
    newSearch(query: SearchQuery, options?: SearchOptions) {
      return newSearch(context, query, options)
    },
    updateSearch(query: SearchQuery, options?: SearchOptions) {
      return updateSearch(context, query, options)
    },
    toggleProductFilter(field: string, value: string, active: boolean) {
      return toggleProductFilter(context, field, value, active)
    },
    replaceFilter(field: string, value: InputSearchRangeFilter | string | undefined) {
      return replaceFilter(context, field, value)
    }
  }
}
