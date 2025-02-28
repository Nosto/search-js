import { ComponentChildren } from "preact"

import { AutocompleteConfig, CategoryConfig, defaultConfig, SerpConfig } from "./config/config"
import { ConfigContext } from "./config/configContext"
import { useCheckClientScript } from "./hooks/useCheckClientScript"
import { createStore } from "./store"
import { StoreContext } from "./storeContext"

export type PublicSerpConfig = Omit<SerpConfig, "pageType" | "defaultCurrency"> &
  Partial<Pick<SerpConfig, "defaultCurrency">>

type SearchProps = {
  config: PublicSerpConfig
  children: ComponentChildren
}

export function NostoSearchPageProvider({ config, children }: SearchProps) {
  const store = createStore()
  const mergedConfig = {
    pageType: "search",
    ...defaultConfig,
    ...config
  } satisfies SerpConfig

  useCheckClientScript()

  return (
    <ConfigContext value={mergedConfig}>
      <StoreContext value={store}>{children}</StoreContext>
    </ConfigContext>
  )
}

type CategoryProps = {
  config: CategoryConfig
  children: ComponentChildren
}

export function NostoCategoryPageProvider({ config, children }: CategoryProps) {
  const store = createStore()
  return (
    <ConfigContext value={config}>
      <StoreContext value={store}>{children}</StoreContext>
    </ConfigContext>
  )
}

type AutocompleteProps = {
  config: AutocompleteConfig
  children: ComponentChildren
}

export function NostoAutocompletePageProvider({ config, children }: AutocompleteProps) {
  const store = createStore()
  return (
    <ConfigContext value={config}>
      <StoreContext value={store}>{children}</StoreContext>
    </ConfigContext>
  )
}
