import { SearchQuery } from "@nosto/nosto-js/client"
import mergeQuery from "@preact/actions/mergeQuery"

import { getNextPageQuery } from "./getNextPageQuery"
import { PageSearchQueryProps } from "./transform"

export type TransformSearchQueryProps = {
  searchQuery: SearchQuery
  pageSearchQueryProps: PageSearchQueryProps
  cache?: boolean
}

export default function transformSearchQuery({
  searchQuery,
  pageSearchQueryProps: { from, size, pageSize },
  cache = false
}: TransformSearchQueryProps) {
  const query = getNextPageQuery({ from, size, pageSize, cache })
  return mergeQuery(searchQuery, query)
}
