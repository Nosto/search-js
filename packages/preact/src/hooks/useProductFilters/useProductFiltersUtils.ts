import { InputSearchTopLevelFilter } from "@nosto/nosto-js/client"
import { useCallback } from "preact/hooks"

import { useActions } from "../useActions"
import { useNostoAppState } from "../useNostoAppState"

export function useProductFiltersUtils() {
  const { facets } = useNostoAppState(state => ({
    facets: state.response.products?.facets ?? []
  }))
  const { replaceFilter, toggleProductFilter } = useActions()

  const findRangeFacet = useCallback(
    (field: string) => {
      const facet = facets?.find(facet => facet.type === "stats" && facet.field === field)

      if (facet && "min" in facet && "max" in facet) {
        return facet
      }

      return undefined
    },
    [facets]
  )

  const getFilterName = useCallback(
    (field: string) => {
      return facets?.find(v => v.field === field)?.name ?? field
    },
    [facets]
  )

  const selectFilters = useCallback((filter: InputSearchTopLevelFilter) => {
    return "field" in filter && (filter.value instanceof Array || filter.range instanceof Array)
  }, [])

  const convertFilterRange = useCallback((filter: InputSearchTopLevelFilter) => {
    return {
      ...filter,
      range: filter.range?.map(fi => ({
        gt: fi.gt ? Number(fi.gt) : fi.gt,
        gte: fi.gte ? Number(fi.gte) : fi.gte,
        lt: fi.lt ? Number(fi.lt) : fi.lt,
        lte: fi.lte ? Number(fi.lte) : fi.lte
      }))
    }
  }, [])

  const toValueFilter = useCallback(
    (filter: InputSearchTopLevelFilter) => {
      const value = filter.value ?? []
      return value.map(val => ({
        value: val,
        field: filter.field!,
        name: getFilterName(filter.field!),
        filter: convertFilterRange(filter),
        remove: () => {
          toggleProductFilter(filter.field!, val, false)
        }
      }))
    },
    [convertFilterRange, getFilterName, toggleProductFilter]
  )

  const toRangeFilter = useCallback(
    (filter: InputSearchTopLevelFilter) => {
      const range = filter.range ?? []
      return range
        .map(fi => {
          const from = fi.gte ?? fi.gt ?? findRangeFacet(filter.field!)?.min
          const to = fi.lte ?? fi.lt ?? findRangeFacet(filter.field!)?.max

          if (from !== undefined && to !== undefined) {
            return {
              value: `${from} - ${to}`,
              field: filter.field!,
              name: getFilterName(filter.field!),
              filter: convertFilterRange(filter),
              remove: () => {
                replaceFilter(filter.field!, undefined)
              }
            }
          }

          return undefined
        })
        .filter(Boolean)
    },
    [convertFilterRange, findRangeFacet, getFilterName, replaceFilter]
  )

  return {
    selectFilters,
    toValueFilter,
    toRangeFilter
  }
}
