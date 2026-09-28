import { ConfigContext } from "@preact/common/config/configContext"
import { StoreActionsListener } from "@preact/common/store/components/StoreActionsListener"
import { createStore, type Store } from "@preact/common/store/store"
import { StoreContext } from "@preact/common/store/storeContext"
import { useCheckClientScript } from "@preact/hooks/useCheckClientScript"
import { savePageScroll } from "@utils/pageScroll/savePageScroll"
import { ComponentChildren } from "preact"
import { useEffect } from "preact/hooks"

import { makeCategoryConfig, PublicCategoryConfig } from "./CategoryConfig"

type CategoryProps = {
  config: PublicCategoryConfig
  store?: Store
  children: ComponentChildren
}

export function CategoryPageProvider({ config, store, children }: CategoryProps) {
  const actualStore = store ?? createStore()
  useCheckClientScript()

  useEffect(() => {
    if (!config.preservePageScroll) {
      return
    }
    window.addEventListener("pagehide", savePageScroll)
    return () => window.removeEventListener("pagehide", savePageScroll)
  }, [config.preservePageScroll])

  return (
    <ConfigContext value={makeCategoryConfig(config)}>
      <StoreContext value={actualStore}>
        <StoreActionsListener />
        {children}
      </StoreContext>
    </ConfigContext>
  )
}
