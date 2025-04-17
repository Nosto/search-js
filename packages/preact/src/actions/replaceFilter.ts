import { InputSearchRangeFilter } from "@nosto/nosto-js/client"
import { measure } from "@utils/performance"

import { ActionContext } from "./types"
import { updateSearch } from "./updateSearch"

export async function replaceFilter(
  context: ActionContext,
  field: string,
  value: InputSearchRangeFilter | string | undefined
): Promise<void> {
  const end = measure("replaceFilter")
  const filter = context.store.getState().query.products?.filter
  const newFilters = value !== undefined ? [{ field, [typeof value === "object" ? "range" : "value"]: [value] }] : []

  await updateSearch({
    context,
    query: {
      products: {
        filter: [...(filter?.filter(v => !(v.field === field)) ?? []), ...newFilters]
      }
    }
  })
  end()
}
