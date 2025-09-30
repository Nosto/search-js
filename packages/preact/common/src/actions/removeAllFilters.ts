import { measure } from "@utils/performance"

import { ActionContext } from "../types"
import { updateSearch } from "./updateSearch"

export async function removeAllFilters(context: ActionContext): Promise<void> {
  const end = measure("removeAllFilters")

  await updateSearch(context, {
    products: {
      filter: []
    }
  })
  end()
}
