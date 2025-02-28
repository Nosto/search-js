import { search as nostoSearch } from "@core/search"
import type { InputSearchTopLevelFilter, SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { PageType } from "@preact/api/types"
import { unique } from "@utils/unique"

import { defaultKeywordFields, defaultProductFields } from "./defaults"

type SearchOptions = Parameters<typeof nostoSearch>[1] & {
  pageType?: PageType
}

export async function search(
  { pageType, maxRetries, retryInterval, isKeyword, hitDecorators }: SearchOptions,
  query: SearchQuery
): Promise<SearchResult> {
  const { queryType, searchQuery } = generateQuery(query, pageType)

  return nostoSearch(searchQuery, {
    redirect: queryType !== "autocomplete",
    track: queryType,
    isKeyword,
    maxRetries,
    hitDecorators,
    retryInterval
  })
}

let logged = false

function generateQuery(
  { ...query }: SearchQuery,
  pageType?: PageType
): {
  queryType: "category" | "autocomplete" | "serp"
  searchQuery: SearchQuery
} {
  const queryType = pageType === "category" ? "category" : pageType === "autocomplete" ? "autocomplete" : "serp"
  const newQuery: SearchQuery = {
    ...query,
    products: {
      facets: queryType === "autocomplete" ? undefined : ["*"],
      fields: defaultProductFields,
      ...query.products,
      sort: query.products?.sort?.filter(v => v.field !== "score"),
      filter: fixFilters(query.products?.filter),
      from: fixNumber(query.products?.from),
      size: fixNumber(query.products?.size)
    },
    ...(query.keywords
      ? {
          keywords: {
            ...query.keywords,
            fields: unique([...defaultKeywordFields, ...(query.keywords?.fields || [])]),
            sort: query.keywords?.sort?.filter(v => v.field !== "score"),
            filter: query.keywords?.filter,
            from: fixNumber(query.keywords?.from),
            size: fixNumber(query.keywords?.size),
            highlight: query.keywords?.highlight || {
              preTag: "<strong>",
              postTag: "</strong>"
            }
          }
        }
      : {})
  }

  return {
    queryType,
    searchQuery: newQuery
  }
}

function fixNumber(v: string | number | undefined): number | undefined {
  return parseInt(String(v), 10) || undefined
}

function fixFilters(filter: InputSearchTopLevelFilter[] | undefined): InputSearchTopLevelFilter[] | undefined {
  // @ts-expect-error type mismatch
  return filter?.map(filter => {
    // Backward support for old style range filter
    if (filter.value instanceof Array) {
      if (filter.value.some(v => Object.keys(v).some(vv => ["gte", "gt", "lt", "lte"].includes(vv)))) {
        if (!logged) {
          // logger.warn("Range filter format is deprecated. Please use the new format.")
          logged = true
        }
        return {
          field: filter.field,
          range: Object.entries(filter.value).reduce<Record<string, unknown>>((prev, [key, value]) => {
            prev[key] = String(value)
            return prev
          }, {})
        }
      }
    }
    return filter
  })
}
