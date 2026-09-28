import { ConfigContext } from "@preact/common/config/configContext"
import { StoreActionsListener } from "@preact/common/store/components/StoreActionsListener"
import { createStore, type Store } from "@preact/common/store/store"
import { StoreContext } from "@preact/common/store/storeContext"
import { useCheckClientScript } from "@preact/hooks/useCheckClientScript"
import { savePageScroll } from "@utils/pageScroll/savePageScroll"
import { ComponentChildren } from "preact"
import { useEffect } from "preact/hooks"

import { makeSerpConfig, PublicSerpConfig } from "./SerpConfig"

type SearchProps = {
  config: PublicSerpConfig
  store?: Store
  children: ComponentChildren
}

export function SearchPageProvider({ config, store, children }: SearchProps) {
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
    <ConfigContext value={makeSerpConfig(config)}>
      <StoreContext value={actualStore}>
        <StoreActionsListener />
        {children}
      </StoreContext>
    </ConfigContext>
  )
}
