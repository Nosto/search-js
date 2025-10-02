import { ConfigContext } from "@preact/common/config/configContext"
import { StoreActionsListener } from "@preact/common/store/components/StoreActionsListener"
import { createStore, type Store } from "@preact/common/store/store"
import { StoreContext } from "@preact/common/store/storeContext"
import { useCheckClientScript } from "@preact/hooks/useCheckClientScript"
import { getSavedHistory } from "@preact/hooks/useHistory"
import { ComponentChildren } from "preact"
import { useEffect } from "preact/hooks"

import { makeAutocompleteConfig, PublicAutocompleteConfig } from "./AutocompleteConfig"

type AutocompleteProps = {
  config: PublicAutocompleteConfig
  store?: Store
  children: ComponentChildren
}

export function AutocompletePageProvider({ config, store, children }: AutocompleteProps) {
  const actualStore = store ?? createStore()
  useCheckClientScript()

  useEffect(() => {
    actualStore.updateState({
      historyItems: getSavedHistory()
    })
  }, [actualStore])

  return (
    <ConfigContext value={makeAutocompleteConfig(config)}>
      <StoreContext value={actualStore}>
        <StoreActionsListener />
        {children}
      </StoreContext>
    </ConfigContext>
  )
}
