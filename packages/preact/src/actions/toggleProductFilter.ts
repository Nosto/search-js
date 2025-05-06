import { SearchOptions } from "@core/types"
import { InputSearchFilter } from "@nosto/nosto-js/client"
import { Config } from "@preact/config/config"
import { isEqual } from "@utils/isEqual"
import { measure } from "@utils/performance"

import { ActionContext } from "./types"
import { updateSearch } from "./updateSearch"

// This function is used to extract search options from the provided config object.
// with backward compatibility with legacy configuration structure.
function searchOptionsFromConfig(config: Config) {
  return {
    hitDecorators: "hitDecorators" in config ? config.hitDecorators : config.search?.hitDecorators,
    maxRetries: "retries" in config ? config.retries : config.search?.maxRetries,
    retryInterval: "retryInterval" in config ? config.retryInterval : config.search?.retryInterval
  } as SearchOptions
}

export async function toggleProductFilter(
  context: ActionContext,
  field: string,
  value: string,
  active: boolean
): Promise<void> {
  const end = measure("toggleProductFilter")
  const filter = context.store.getState().query.products?.filter

  const activeFilter = filter?.find(v => {
    return v.value instanceof Array && v.field === field
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

  await updateSearch(
    context,
    {
      products: {
        filter: [...(filter?.filter(v => v !== activeFilter) ?? []), ...(newFilter?.value?.length ? [newFilter] : [])]
      }
    },
    searchOptionsFromConfig(context.config)
  )
  end()
}
