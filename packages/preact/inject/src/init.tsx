import { createStore } from "@preact/common/store/store"

import { InitConfig } from "./config"
import { injectAutocomplete } from "./init/injectAutocomplete"
import { injectCategory } from "./init/injectCategory"
import { injectSerp } from "./init/injectSerp"

export async function init(config: InitConfig) {
  if (config.autocomplete) {
    await injectAutocomplete()
  }
  if (config.category && (!config.category.isCategoryPage || config.category.isCategoryPage?.())) {
    await injectCategory(config.category, createStore())
  }
  if (config.serp) {
    await injectSerp()
  }
}
