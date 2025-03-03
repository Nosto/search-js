import { ConfigContext } from "@preact/config/configContext"
import { useCheckClientScript } from "@preact/hooks/useCheckClientScript"
import { createStore, Store } from "@preact/store"
import { StoreContext } from "@preact/storeContext"
import { ComponentChildren } from "preact"

import { makeCategoryConfig, PublicCategoryConfig } from "./config"

type CategoryProps = {
  config: PublicCategoryConfig
  store?: Store
  children: ComponentChildren
}

export function NostoCategoryPageProvider({ config, store, children }: CategoryProps) {
  const actualStore = store ?? createStore()
  useCheckClientScript()

  return (
    <ConfigContext value={makeCategoryConfig(config)}>
      <StoreContext value={actualStore}>{children}</StoreContext>
    </ConfigContext>
  )
}
