import type { SearchQuery } from "@nosto/nosto-js/client"

export type PageType = "search" | "category" | "autocomplete"

export type MaybeProvider<T> = T | (() => T)
export type QueryProvider = MaybeProvider<Partial<SearchQuery>>
