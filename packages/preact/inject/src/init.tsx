import { makeAutocompleteConfig } from "@preact/autocomplete/AutocompleteConfig"
import { makeCategoryConfig } from "@preact/category/CategoryConfig"
import { createStore } from "@preact/common/store/store"
import { makeSerpConfig } from "@preact/serp/SerpConfig"

import { InitConfig } from "./config"
import { injectAutocomplete } from "./init/injectAutocomplete"
import { injectCategory } from "./init/injectCategory"
import { injectSerp } from "./init/injectSerp"

export async function init(initConfig: InitConfig) {
  if (initConfig.autocomplete) {
    await injectAutocomplete(
      {
        ...initConfig.autocomplete,
        config: makeAutocompleteConfig(initConfig.autocomplete.config)
      },
      createStore({ query: initConfig.autocomplete.query })
    )
  }
  if (initConfig.category) {
    await injectCategory(
      {
        ...initConfig.category,
        config: makeCategoryConfig(initConfig.category.config)
      },
      createStore()
    )
  }
  if (initConfig.serp) {
    await injectSerp(
      {
        ...initConfig.serp,
        config: makeSerpConfig(initConfig.serp.config)
      },
      createStore()
    )
  }
}
