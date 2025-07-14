import { ConfigContext } from "@preact/common/config/configContext"
import { createStore, type Store } from "@preact/common/store/store"
import { StoreContext } from "@preact/common/store/storeContext"
import { useCheckClientScript } from "@preact/hooks/useCheckClientScript"
import { ComponentChildren } from "preact"

import { makeCategoryConfig, PublicCategoryConfig } from "./CategoryConfig"

type CategoryProps = {
  config: PublicCategoryConfig
  store?: Store
  children: ComponentChildren
}

export function CategoryPageProvider({ config, store, children }: CategoryProps) {
  const actualStore = store ?? createStore()
  useCheckClientScript()

  return (
    <ConfigContext value={makeCategoryConfig(config)}>
      <StoreContext value={actualStore}>{children}</StoreContext>
    </ConfigContext>
  )
}
