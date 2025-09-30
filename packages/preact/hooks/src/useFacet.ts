import type { SearchTermsFacet } from "@nosto/nosto-js/client"
import { useConfig } from "@preact/common/config/configContext"
import { useEventBusSubscribe } from "@preact/events/eventBusSubscribe"
import { useCallback, useEffect, useState } from "preact/hooks"

import { useActions } from "./useActions"

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
  const { pageType } = useConfig()

  const toggleActive = useCallback(() => {
    setActive(!active)
  }, [active])

  // Listen for removeAllFilters event and reset active state to false
  useEventBusSubscribe({
    event: "actions/removeAllFilters",
    callback: ({ targetStore }) => {
      if (pageType === targetStore) {
        setActive(false)
      }
    }
  })

  // Update active state when facet data changes (when filters are cleared)
  useEffect(() => {
    const selectedFiltersCount = facet.data?.filter(v => v.selected).length ?? 0
    if (selectedFiltersCount === 0 && !options?.active) {
      setActive(false)
    } else if (selectedFiltersCount > 0 && !options?.active) {
      setActive(true)
    }
  }, [facet.data, options?.active])

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
