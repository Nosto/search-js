import { parseNumber } from "@utils/parseNumber"

import { useActions } from "./useActions"
import { useNostoAppState } from "./useNostoAppState"

/**
 * A hook that returns range information and functions to update the range.
 *
 * @param id - The identifier for the specific range facet.
 * @returns An object containing range information and functions to update the range.
 *
 * @example
 * General usage with `useRange`:
 * ```jsx
 * import { useRange } from "@nosto/search-js/preact";
 * import { useState } from "react";
 *
 * const Component = ({ facetId }) => {
 *   const { min, max, range, updateRange } = useRange(facetId);
 *
 *   return (
 *     <div>
 *       Current Range: {range[0]} to {range[1]}
 *       <button onClick={() => updateRange([min, max])}>Reset Range</button>
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

  if (!stat) {
    return {
      min: 0,
      max: 0,
      range: [0, 0],
      updateRange: () => {}
    }
  }

  const filter = query.products?.filter?.find(v => v.field === stat.field)

  const filterValue = filter?.range ? filter.range[0] : undefined
  const value =
    typeof filterValue === "object" && ("gte" in filterValue || "lte" in filterValue)
      ? ([parseNumber(filterValue.gte), parseNumber(filterValue.lte)] as const)
      : ([undefined, undefined] as const)

  const min = "min" in stat ? Math.floor(stat.min) : 0
  const max = "max" in stat ? Math.ceil(stat.max) : 0

  const updateRange = ([from, to]: [number | undefined, number | undefined]) => {
    const fromRounded = from !== undefined ? Math.floor(from) : undefined
    const toRounded = to !== undefined ? Math.ceil(to) : undefined
    const fromDefined = fromRounded !== undefined
    const toDefined = toRounded !== undefined

    if ((min === fromRounded || !fromDefined) && (max === toRounded || !toDefined)) {
      replaceFilter(stat.field, undefined)
    } else if ((min === fromRounded || !fromDefined) && toDefined) {
      replaceFilter(stat.field, {
        lte: toRounded.toString()
      })
    } else if ((max === toRounded || !toDefined) && fromDefined) {
      replaceFilter(stat.field, {
        gte: fromRounded.toString()
      })
    } else if (fromDefined && toDefined) {
      replaceFilter(stat.field, {
        gte: fromRounded.toString(),
        lte: toRounded.toString()
      })
    }
  }

  return {
    /** Min value */
    min,
    /** Max value */
    max,
    /** Range value */
    range: [value[0] ?? min, value[1] ?? max],
    /** Update range function */
    updateRange
  }
}
