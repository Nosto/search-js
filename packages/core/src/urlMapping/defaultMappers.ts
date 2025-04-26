/* eslint-disable @typescript-eslint/no-unused-vars */
import { InputSearchFilter, InputSearchRangeFilter, InputSearchSort, SearchQuery } from "@nosto/nosto-js/client"

import { Mappers, PageData, UrlMappingConfig } from "./types"
import { escape, joinValues, splitValues, unescape } from "./utils"

function createQueryMapper({ queryField }: UrlMappingConfig) {
  return {
    field: (v: string) => v === queryField,
    encode(value: string, target: URLSearchParams) {
      if (value) {
        target.set(queryField, value)
      }
    },
    decode(value: string, _: string) {
      return value
    }
  }
}

function createSortMapper({ sortField, sortSeparator }: UrlMappingConfig) {
  const outerSeparator = ","
  return {
    field: (v: string) => v === sortField,
    encode(value: InputSearchSort[], target: URLSearchParams) {
      if (value?.length) {
        const urlValue = joinValues(
          value.map(s => joinValues([s.field, s.order], sortSeparator)),
          outerSeparator
        )
        target.set(sortField, urlValue)
      }
    },
    decode(encoded: string, _: string): InputSearchSort[] {
      return splitValues(encoded, outerSeparator).map(v => {
        const [fieldName, order] = splitValues(v, sortSeparator)
        return {
          field: fieldName,
          order: (order as InputSearchSort["order"]) ?? "asc"
        }
      })
    }
  }
}

function createRangeMapper({ filterRangeSeparator, filterValueSeparator }: UrlMappingConfig) {
  return {
    encode(range: InputSearchRangeFilter[]) {
      return joinValues(
        range.map(value => {
          const gtE = value.gte || (value.gt ? `[${value.gt}` : "")
          const ltE = value.lte || (value.lt ? `${value.lt}]` : "")
          return joinValues([gtE, ltE], filterRangeSeparator)
        }),
        filterValueSeparator
      )
    },
    decode(encoded: string): InputSearchRangeFilter[] {
      return splitValues(encoded, filterValueSeparator).map(r => {
        const [gte, lte] = splitValues(r, filterRangeSeparator)
        const range: InputSearchRangeFilter = {}
        if (lte) {
          range[lte.includes("]") ? "lt" : "lte"] = lte.replace(/[[{\]}']/gm, "")
        }
        if (gte) {
          range[gte.includes("[") ? "gt" : "gte"] = gte.replace(/[[{\]}']/gm, "")
        }
        return range
      })
    }
  }
}

function createFilterMapper(config: UrlMappingConfig) {
  const rangeMapper = createRangeMapper(config)
  const inverseMapping = Object.fromEntries(
    Object.entries(config.filterMapping ?? {}).map(([key, value]) => [value, key])
  )
  return {
    field: (v: string) => v.startsWith(config.filterFieldPrefix) || !!config.filterMapping?.[v],
    encode(value: InputSearchFilter[], target: URLSearchParams) {
      value.forEach(v => {
        const field = inverseMapping[v.field!] ?? config.filterFieldPrefix + v.field
        if (v.range) {
          const queryValue = rangeMapper.encode(v.range)
          target.set(field, queryValue)
        } else {
          const queryValue = joinValues(v.value!, config.filterValueSeparator)
          const escaped = escape(queryValue, config.filterRangeSeparator)
          target.set(field, escaped)
        }
      })
    },
    decode(encoded: string, key: string): InputSearchFilter[] {
      const field = config.filterMapping?.[key] ?? key.substring(config.filterFieldPrefix.length)
      if (encoded.includes(config.filterRangeSeparator)) {
        const range = rangeMapper.decode(encoded)
        return [{ field, range }]
      }
      const unescaped = unescape(encoded, config.filterRangeSeparator)
      const value = splitValues(unescaped, config.filterValueSeparator)
      return [{ field, value }]
    }
  }
}

function createPaginationMapper(query: SearchQuery, { pageField, pageSizeField }: UrlMappingConfig) {
  return {
    field: (v: string) => v === pageField || v === pageSizeField,
    encode({ from, size }: PageData, target: URLSearchParams) {
      if (from) {
        target.set(pageField, String(from / size + 1))
      }
      if (size && size !== query.products?.size) {
        target.set(pageSizeField, String(size))
      }
    },
    decode(encoded: string, key: string): PageData {
      if (key === pageField) {
        const size = query.products?.size ?? 0
        return { from: (parseInt(encoded, 10) - 1) * size, size }
      } else {
        return { size: parseInt(encoded, 10) }
      }
    }
  }
}

export function createMappers(baseQuery: SearchQuery, config: UrlMappingConfig) {
  return {
    query: createQueryMapper(config),
    sort: createSortMapper(config),
    filter: createFilterMapper(config),
    pagination: createPaginationMapper(baseQuery, config)
  } satisfies Mappers
}
