import { ConfigContext } from "@preact/common/config/configContext"
import { StoreActionsListener } from "@preact/common/store/components/StoreActionsListener"
import { createStore, type Store } from "@preact/common/store/store"
import { StoreContext } from "@preact/common/store/storeContext"
import { useCheckClientScript } from "@preact/hooks/useCheckClientScript"
import { ComponentChildren } from "preact"

import { makeAutocompleteConfig, PublicAutocompleteConfig } from "./AutocompleteConfig"
import { useHistory } from "@preact/hooks/useHistory"

type AutocompleteProps = {
  config: PublicAutocompleteConfig
  store?: Store
  children: ComponentChildren
}

export function AutocompletePageProvider({ config, store, children }: AutocompleteProps) {
  const actualStore = store ?? createStore()
  useCheckClientScript()

  const { readSaved } = useHistory()

  actualStore.updateState({
    historyItems: readSaved()
  })

  return (
    <ConfigContext value={makeAutocompleteConfig(config)}>
      <StoreContext value={actualStore}>
        <StoreActionsListener />
        {children}
      </StoreContext>
    </ConfigContext>
  )
}
