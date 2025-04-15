import { Options as SearchConfig } from "@core/types"
import type { SearchQuery } from "@nosto/nosto-js/client"
import { deepMerge } from "@utils/deepMerge"
import { measure } from "@utils/performance"

import { newSearch } from "./newSearch"
import { ActionContext } from "./types"
import { SearchResultTransformer } from "@preact/hooks/useLoadMore/transformSearchResult"

export type UpdateSearchOptions = {
  context: ActionContext
  query: SearchQuery
  options?: SearchConfig
  transformer?: SearchResultTransformer
}

export async function updateSearch({
  context,
  query,
  options,
  transformer }: UpdateSearchOptions
): Promise<void> {
  const end = measure("updateSearch")
  const fullQuery = deepMerge(context.store.getState().query, { products: { from: 0 } }, query)

  await newSearch({context, query: fullQuery, options, transformer})
  end()
}
