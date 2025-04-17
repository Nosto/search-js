import { SearchQuery } from "@nosto/nosto-js/client"
import { deepMerge } from "@utils/deepMerge"

export default function mergeQuery(...queries: SearchQuery[]): SearchQuery {
  return queries.reduce((acc, query) => {
    return deepMerge(acc, query)
  }, {})
}
