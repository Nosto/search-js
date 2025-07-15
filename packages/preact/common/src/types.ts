import type { SearchQuery } from "@nosto/nosto-js/client"

import { Store } from "../common"
import { Config } from "./config/config"

export type PageType = "search" | "category" | "autocomplete"

export type MaybeProvider<T> = T | (() => T)
export type QueryProvider = MaybeProvider<Partial<SearchQuery>>

export type ActionContext = {
  store: Store
  config: Config
}
