import { Options as SearchConfig } from "@core/types"
import type { SearchQuery } from "@nosto/nosto-js/client"
import { Transformer } from "@preact/hooks/useLoadMore/transform"
import { measure } from "@utils/performance"

import applyModifications from "./applyModifications"
import mergeQuery from "./mergeQuery"
import { doSearch } from "./newSearch"
import { ActionContext } from "./types"

export type UpdateSearchOptions = {
  context: ActionContext
  query: SearchQuery
  options?: SearchConfig
  transformer?: Transformer
}

export async function updateSearch({ context, query, options, transformer }: UpdateSearchOptions): Promise<void> {
  const end = measure("updateSearch")

  const mergeWithCurrentQuery = mergeQuery(context.store.getState().query, { products: { from: 0 } }, query)
  const mergedQuery = mergeQuery(context.store.getInitialState().query, mergeWithCurrentQuery)

  const queryWithModifications = applyModifications(context, mergedQuery, mergeWithCurrentQuery)

  await doSearch({ context, mergedQuery, queryWithModifications, options, transformer })
  end()
}
