import type { SearchQuery } from "@nosto/nosto-js/client"
import { deepMerge } from "@utils/deepMerge"
import { measure } from "@utils/performance"

import { ActionContext } from "../types"
import { newSearch, NewSearchOptions } from "./newSearch"

export async function updateSearch(
  context: ActionContext,
  query: SearchQuery,
  options?: NewSearchOptions
): Promise<void> {
  const end = measure("updateSearch")
  const fullQuery = deepMerge(context.store.getState().query, { products: { from: 0 } }, query)

  await newSearch(context, fullQuery, options)
  end()
}
