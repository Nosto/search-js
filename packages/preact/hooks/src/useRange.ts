import { InputSearchTopLevelFilter, SearchFacet } from "@nosto/nosto-js/client"
import { useEventBusSubscribe } from "@preact/events/eventBusSubscribe"
import { parseNumber } from "@utils/parseNumber"
import { useCallback, useState } from "preact/hooks"

import { useActions } from "./useActions"
import { useNostoAppState } from "./useNostoAppState"

const extractRangeValues = (filter?: InputSearchTopLevelFilter) => {
  const filterValue = filter?.range ? filter.range[0] : undefined

  if (typeof filterValue === "object" && ("gte" in filterValue || "lte" in filterValue)) {
    return [parseNumber(filterValue.gte), parseNumber(filterValue.lte)] as const
  }

  return [undefined, undefined]
}

const calculateMinMax = (stat?: SearchFacet) => {
  const min = stat && "min" in stat ? Math.floor(stat.min ?? 0) : 0
  const max = stat && "max" in stat ? Math.ceil(stat.max ?? 0) : 0
  return [min, max]
}

const createRangeFilter = (from: number | undefined, to: number | undefined, min: number, max: number) => {
  const fromRounded = from !== undefined ? Math.floor(from) : undefined
  const toRounded = to !== undefined ? Math.ceil(to) : undefined
  const fromDefined = fromRounded !== undefined
  const toDefined = toRounded !== undefined

  if ((min === fromRounded || !fromDefined) && (max === toRounded || !toDefined)) {
    return undefined
  }

  if ((min === fromRounded || !fromDefined) && toDefined) {
    return { lte: toRounded.toString() }
  }

  if ((max === toRounded || !toDefined) && fromDefined) {
    return { gte: fromRounded.toString() }
  }

  if (fromDefined && toDefined) {
    return {
      gte: fromRounded.toString(),
      lte: toRounded.toString()
    }
  }

  return undefined
}

/**
 * A hook that returns range information and functions to update the range.
 *
 * @param id - The identifier for the specific range facet.
 * @returns An object containing range information, active state, and functions to update the range.
 *
 * @example
 * General usage with `useRange`:
 * ```jsx
 * import { useRange } from "@nosto/search-js/preact/hooks";
 * import { useState } from "react";
 *
 * const Component = ({ facetId }) => {
 *   const { min, max, range, active, toggleActive, updateRange } = useRange(facetId);
 *
 *   return (
 *     <div>
 *       <button onClick={() => toggleActive()}>
 *         {active ? "Hide" : "Show"} Range Filter
 *       </button>
 *       {active && (
 *         <div>
 *           Current Range: {range[0]} to {range[1]}
 *           <button onClick={() => updateRange([min, max])}>Reset Range</button>
 *         </div>
 *       )}
 *     </div>
 *   );
 * };
 * ```
 */
export function useRange(id: string) {
  const { replaceFilter } = useActions()
  const { query, products } = useNostoAppState(state => ({
    query: state.query,
    products: state.response.products
  }))
  const stat = products?.facets?.find(v => v.id === id)

  const filter = query.products?.filter?.find(v => v.field === stat?.field)
  const value = extractRangeValues(filter)
  const [min, max] = calculateMinMax(stat)

  const hasActiveFilter = value[0] !== undefined || value[1] !== undefined
  const [active, setActive] = useState(hasActiveFilter)

  const toggleActive = useCallback(() => {
    setActive(prev => !prev)
  }, [])

  const updateRange = useCallback(
    ([from, to]: (number | undefined)[]) => {
      if (!stat) return

      const filterObject = createRangeFilter(from, to, min, max)
      replaceFilter(stat.field, filterObject)
    },
    [min, max, replaceFilter, stat]
  )

  useEventBusSubscribe({
    event: "events/removeAllFilters",
    callback: () => {
      setActive(false)
    }
  })

  if (!stat) {
    return {
      min: 0,
      max: 0,
      range: [0, 0],
      active: false,
      toggleActive: () => {},
      updateRange: () => {}
    }
  }

  return {
    min,
    max,
    range: [value[0] ?? min, value[1] ?? max],
    active,
    toggleActive,
    updateRange
  }
}
