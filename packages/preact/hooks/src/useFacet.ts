import type { SearchTermsFacet } from "@nosto/nosto-js/client"
import { useCallback, useEffect, useState } from "preact/hooks"

import { useActions } from "./useActions"
import { useNostoAppState } from "./useNostoAppState"

/**
 * Extra options for the useFacet hook.
 */
export interface UseFacetOptions {
  active?: boolean
}

/**
 * Preact hook that provides facet state to the component.
 * @param facet
 * @example
 * ```jsx
 * import { useFacet } from '@nosto/search-js/preact/hooks'
 *
 * export default () => {
 *     const { active, selectedFiltersCount, toggleActive, toggleProductFilter } = useFacet(facet)
 *     return (
 *         <li class={`ns-sidebar-dropdown ${active ? "ns-active" : ""}`}>
 *             <span
 *                 onClick={toggleActive}
 *             >
 *                 <span>{facet.name}</span>
 *                 {selectedFiltersCount > 0 && (
 *                     <span>{selectedFiltersCount}</span>
 *                 )}
 *             </span>
 *             <div>
 *                 <ul>
 *                     {facet.data?.map(value => (
 *                         <li key={value.value}>
 *                             <label>
 *                                 {value.value}
 *                                 <input
 *                                     type="checkbox"
 *                                     checked={value.selected}
 *                                     onChange={e => {
 *                                         e.preventDefault()
 *                                         toggleProductFilter(
 *                                             facet.field,
 *                                             value.value,
 *                                             !value.selected
 *                                         )
 *                                     }}
 *                                 />
 *                             </label>
 *                             <span>{value.count}</span>
 *                         </li>
 *                     ))}
 *                 </ul>
 *             </div>
 *         </li>
 *     );
 * }
 * ```
 * @group Hooks
 */
export function useFacet(facet: SearchTermsFacet, options?: UseFacetOptions) {
  const selectedFiltersCount = facet.data?.filter(v => v.selected).length ?? 0

  const { active: initialActive } = {
    active: selectedFiltersCount > 0,
    ...options
  } satisfies UseFacetOptions

  const [active, setActive] = useState(initialActive)
  const { toggleProductFilter } = useActions()

  // Listen to global filter state to detect when all filters are cleared
  const { filter } = useNostoAppState(state => ({
    filter: state.query.products?.filter ?? []
  }))

  // Reset active state when all filters are cleared and no explicit active option is set
  useEffect(() => {
    if (filter.length === 0 && !options?.active) {
      setActive(false)
    }
  }, [filter.length, options?.active])

  const toggleActive = useCallback(() => {
    setActive(!active)
  }, [active])

  return {
    /** Active value */
    active,
    /** Selected filters count */
    selectedFiltersCount,
    /** Toggle active function */
    toggleActive,
    /** Toggle product filter function */
    toggleProductFilter
  }
}
