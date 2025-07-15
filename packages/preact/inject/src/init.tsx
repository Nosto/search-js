import { createStore } from "@preact/common/store/store"

import { InitConfig } from "./config"
import { injectAutocomplete } from "./init/injectAutocomplete"
import { injectCategory } from "./init/injectCategory"
import { injectSerp } from "./init/injectSerp"

export async function init(config: InitConfig) {
  if (config.autocomplete) {
    await injectAutocomplete()
  }
  if (config.category) {
    await injectCategory(config.category, createStore())
  }
  if (config.serp) {
    await injectSerp(config.serp, createStore())
  }
}
