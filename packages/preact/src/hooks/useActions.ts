import type { SearchOptions, SearchQuery } from "@nosto/nosto-js/client"
import { useConfig } from "@preact/config/configContext"
import { StoreContext } from "@preact/storeContext"
import { useContext } from "preact/hooks"

import { newSearch, updateSearch } from "./actions"

/**
 * Preact hook that import current actions to the component.
 * Actions should be used to modify state, making new searches, etc.
 *
 * @example
 * ```jsx
 * import { useActions } from '@nosto/preact'
 *
 * export default () => {
 *     const { newSearch } = useActions()
 *
 *     return <button onClick={() => {
 *         newSearch({
 *             query: {
 *                 query: "samsung"
 *             }
 *         })
 *     }}>
 *         Search for "samsung"
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
    updateSearch(query: SearchQuery, options?: SearchOptions) {
      return updateSearch(context, query, options)
    },
    newSearch(query: SearchQuery, options?: SearchOptions) {
      return newSearch(context, query, options)
    }
  }
}
