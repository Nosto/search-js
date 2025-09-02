import { makeAutocompleteConfig } from "@preact/autocomplete/AutocompleteConfig"
import { makeCategoryConfig } from "@preact/category/CategoryConfig"
import { createStore, Store } from "@preact/common/store/store"
import { makeSerpConfig } from "@preact/serp/SerpConfig"

import { InitConfig } from "./config"
import { injectAutocomplete } from "./init/injectAutocomplete"
import { injectCategory } from "./init/injectCategory"
import { injectSerp } from "./init/injectSerp"

export interface InitResult {
  autocomplete?: { store: Store }
  category?: { store: Store }
  serp?: { store: Store }
}

export async function init({ autocomplete, category, serp }: InitConfig): Promise<InitResult> {
  const result: InitResult = {}

  if (autocomplete) {
    const store = createStore({ query: autocomplete.query })
    await injectAutocomplete(
      {
        ...autocomplete,
        config: makeAutocompleteConfig(autocomplete.config)
      },
      store
    )
    result.autocomplete = { store }
  }
  if (category) {
    const store = createStore({ query: category.query })
    await injectCategory(
      {
        ...category,
        config: makeCategoryConfig(category.config)
      },
      store
    )
    result.category = { store }
  }
  if (serp) {
    const store = createStore({ query: serp.query })
    await injectSerp(
      {
        ...serp,
        config: makeSerpConfig(serp.config)
      },
      store
    )
    result.serp = { store }
  }

  return result
}
