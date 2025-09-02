import { createContext } from "preact"
import { useContext } from "preact/hooks"

import { Config } from "./config"

export const ConfigContext = createContext<Config | null>(null)

export function useConfig() {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider")
  }
  return context
}

export function useSerpConfig() {
  const context = useConfig()
  if (context.pageType !== "search") {
    throw new Error("useSerpConfig must be used within a NostoSearchPageProvider")
  }
  return context
}

export function useCategoryConfig() {
  const context = useConfig()
  if (context.pageType !== "category") {
    throw new Error("useCategoryConfig must be used within a NostoCategoryPageProvider")
  }
  return context
}

export function useAutocompleteConfig() {
  const context = useConfig()
  if (context.pageType !== "autocomplete") {
    throw new Error("useAutocompleteConfig must be used within a NostoAutocompletePageProvider")
  }
  return context
}
