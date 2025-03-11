import { useMemo } from "preact/hooks"

import { useNostoAppState } from "./useNostoAppState"

/**
 * @group Hooks
 * @returns The number of selected filters.
 * @example
 * ```jsx
 * import { useSelectedFiltersCount } from '@nosto/search-js/preact'
 * export default () => {
 *    const selectedFiltersCount = useSelectedFiltersCount()
 *    return (
 *        <div>
 *            {selectedFiltersCount} filters selected
 *        </div>
 *    )
 * }
 * ```
 */
export function useSelectedFiltersCount() {
  const filter = useNostoAppState(state => state.query.products?.filter)

  const selectedFiltersCount = useMemo(() => {
    if (!filter) {
      return 0
    }
    return filter.reduce((acc, curr) => acc + (Array.isArray(curr.value) ? curr.value.length : 1), 0)
  }, [filter])

  return selectedFiltersCount
}
