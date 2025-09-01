import { makeAutocompleteConfig } from "@preact/autocomplete/AutocompleteConfig"
import { makeCategoryConfig } from "@preact/category/CategoryConfig"
import { createStore } from "@preact/common/store/store"
import { makeSerpConfig } from "@preact/serp/SerpConfig"

import { InitConfig } from "./config"
import { injectAutocomplete } from "./init/injectAutocomplete"
import { injectCategory } from "./init/injectCategory"
import { injectSerp } from "./init/injectSerp"

export async function init({ autocomplete, category, serp }: InitConfig) {
  if (autocomplete) {
    await injectAutocomplete(
      {
        ...autocomplete,
        config: makeAutocompleteConfig(autocomplete.config)
      },
      createStore({ query: autocomplete.query })
    )
  }
  if (category) {
    await injectCategory(
      {
        ...category,
        config: makeCategoryConfig(category.config)
      },
      createStore({ query: category.query })
    )
  }
  if (serp) {
    await injectSerp(
      {
        ...serp,
        config: makeSerpConfig(serp.config)
      },
      createStore({ query: serp.query })
    )
  }
}
