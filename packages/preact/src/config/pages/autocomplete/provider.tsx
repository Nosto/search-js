import { ConfigContext } from "@preact/config/configContext"
import { useCheckClientScript } from "@preact/hooks/useCheckClientScript"
import { createStore, Store } from "@preact/store"
import { StoreContext } from "@preact/storeContext"
import { ComponentChildren } from "preact"

import { makeAutocompleteConfig, PublicAutocompleteConfig } from "./config"

type AutocompleteProps = {
  config: PublicAutocompleteConfig
  store?: Store
  children: ComponentChildren
}

export function NostoAutocompletePageProvider({ config, store, children }: AutocompleteProps) {
  const actualStore = store ?? createStore()
  useCheckClientScript()

  return (
    <ConfigContext value={makeAutocompleteConfig(config)}>
      <StoreContext value={actualStore}>{children}</StoreContext>
    </ConfigContext>
  )
}
