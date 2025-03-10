import { InputSearchFilter } from "@nosto/nosto-js/client"
import { isEqual } from "@utils/isEqual"
import { measure } from "@utils/performance"

import { ActionContext } from "./types"
import { updateSearch } from "./updateSearch"

export async function toggleProductFilter(
  context: ActionContext,
  field: string,
  value: string,
  active: boolean
): Promise<void> {
  const end = measure("toggleProductFilter")
  const filter = context.store.getState().query.products?.filter

  const activeFilter = filter?.find(v => {
    return (
      v.value instanceof Array &&
      // @ts-expect-error not sure, if used by clients
      v.filterFacets !== true &&
      v.field === field
    )
  })

  const newFilter: InputSearchFilter | undefined = activeFilter?.value
    ? {
        ...activeFilter,
        value: [...activeFilter.value.filter(v => !isEqual(v, value)), ...(active ? [value] : [])]
      }
    : active
      ? {
          field,
          value: [value]
        }
      : undefined

  await updateSearch(context, {
    products: {
      filter: [...(filter?.filter(v => v !== activeFilter) ?? []), ...(newFilter?.value?.length ? [newFilter] : [])]
    }
  })
  end()
}
