import { parseNumber } from "@utils/parseNumber"
import { useCallback, useMemo } from "preact/hooks"

import { useProductFilters } from "./useProductFilters/useProductFilters"
import { useRange } from "./useRange"

// TODO: Add a new example that does not use the `RangeInput` and `RadioButton` components

/**
 * Get range selector state
 * @param id - Id of the range Selector
 * @example
 * ```jsx
 * import { useRangeCheckboxes } from "@nosto/search-js/preact/hooks"
 * import { useState } from "preact/hooks"
 * import RadioButton from "./elements/RadioButton"
 * import RangeInput from "./elements/RangeInput"
 *
 * export default function RangeSelector({ facet }) {
 *     const {
 *         min,
 *         max,
 *         range,
 *         ranges,
 *         updateRange,
 *         handleMinChange,
 *         handleMaxChange,
 *         isSelected,
 *     } = useRangeSelector(facet.id, 100)
 *
 *     return (
 *         <li>
 *             <div>
 *                 <ul>
 *                     {ranges.map(({ min, max, selected }, index) => {
 *                         return (
 *                             <li>
 *                                 <RadioButton
 *                                     key={index}
 *                                     value={`${min} - ${max}`}
 *                                     selected={selected}
 *                                     onChange={() => updateRange([min, max])}
 *                                 />
 *                             </li>
 *                         )
 *                     })}
 *                     <div>
 *                         <div>
 *                             <label htmlFor={`ns-${facet.id}-min`}>
 *                                 Min.
 *                             </label>
 *                             <RangeInput
 *                                 id={`ns-${facet.id}-min`}
 *                                 min={min}
 *                                 max={max}
 *                                 range={range}
 *                                 value={range[0] ?? min}
 *                                 onChange={e => handleMinChange(parseFloat(e.currentTarget.value) || min)}
 *                             />
 *                         </div>
 *                         <div>
 *                             <label htmlFor={`ns-${facet.id}-max`}>
 *                                 Max.
 *                             </label>
 *                             <RangeInput
 *                                 id={`ns-${facet.id}-max`}
 *                                 min={min}
 *                                 max={max}
 *                                 range={range}
 *                                 value={range[1] ?? max}
 *                                 onChange={e => handleMaxChange(parseFloat(e.currentTarget.value) || max)}
 *                             />
 *                         </div>
 *                     </div>
 *                 </ul>
 *             </div>
 *         </li>
 *     )
 * }
 *
 *```
 *
 * @group Hooks
 */
export function useRangeSelector(id: string, rangeSize: number) {
  const { min, max, range, updateRange } = useRange(id)
  const { filters } = useProductFilters()

  const ranges = useMemo(() => {
    const rangeFilter = filters.find(filter => filter?.filter?.range)
    let activeRange = null
    if (rangeFilter) {
      const range = rangeFilter.filter.range?.[0]
      activeRange = [parseNumber(range?.gte), parseNumber(range?.lte)]
    }

    const ranges = []
    let start = Math.floor(min / rangeSize) * rangeSize

    while (start < max) {
      const end = start + rangeSize
      const selected = activeRange && activeRange[0] === start && activeRange[1] === end

      ranges.push({
        min: start,
        max: end,
        selected
      })
      start = end
    }
    return ranges
  }, [filters, min, max, rangeSize])

  const handleMinChange = useCallback(
    (value: number) => {
      updateRange([value, range[1]])
    },
    [range, updateRange]
  )

  const handleMaxChange = useCallback(
    (value: number) => {
      updateRange([range[0], value])
    },
    [range, updateRange]
  )

  const isSelected = min !== range[0] || max !== range[1]

  return {
    /** Minimum value */
    min,
    /** Maximum value */
    max,
    /** Range value */
    range,
    /** Update range function */
    updateRange,
    /** Ranges */
    ranges,
    /** Handle min change */
    handleMinChange,
    /** Handle max change */
    handleMaxChange,
    /** Is selected */
    isSelected
  }
}
