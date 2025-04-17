import { SearchQuery } from "@nosto/nosto-js/client"
import mergeQuery from "@preact/actions/mergeQuery"

import { getNextPageQuery } from "./getNextPageQuery"
import { PageSearchQueryProps } from "./transform"

export default function transformSearchQuery(searchQuery: SearchQuery, { from, size, pageSize }: PageSearchQueryProps) {
  const query = getNextPageQuery({ from, size, pageSize, cache: true })
  return mergeQuery(searchQuery, query)
}
