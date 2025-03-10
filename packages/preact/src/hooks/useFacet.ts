import type { SearchTermsFacet } from "@nosto/nosto-js/client"
import { useState } from "preact/hooks"

import { useActions } from "./useActions"

/**
 * Preact hook that provides facet state to the component.
 * @param facet
 * @example
 * ```jsx
 * import { useFacet } from '@nosto/search-js/preact'
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
export function useFacet(facet: SearchTermsFacet) {
  const selectedFiltersCount = facet.data?.filter(v => v.selected).length ?? 0
  const [active, setActive] = useState(selectedFiltersCount > 0)
  const { toggleProductFilter } = useActions()

  const toggleActive = () => {
    setActive(!active)
  }

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
