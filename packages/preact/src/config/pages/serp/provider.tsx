import { ConfigContext } from "@preact/config/configContext"
import { useCheckClientScript } from "@preact/hooks/useCheckClientScript"
import { createStore, Store } from "@preact/store"
import { StoreContext } from "@preact/storeContext"
import { ComponentChildren } from "preact"

import { makeSerpConfig, PublicSerpConfig } from "./config"

type SearchProps = {
  config: PublicSerpConfig
  store?: Store
  children: ComponentChildren
}

export function NostoSearchPageProvider({ config, store, children }: SearchProps) {
  const actualStore = store ?? createStore()
  useCheckClientScript()

  return (
    <ConfigContext value={makeSerpConfig(config)}>
      <StoreContext value={actualStore}>{children}</StoreContext>
    </ConfigContext>
  )
}
