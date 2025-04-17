import { useConfig } from "@preact/config/configContext"
import { StoreContext } from "@preact/storeContext"
import { useContext, useMemo } from "preact/hooks"

export function useActionsContext() {
  const config = useConfig()
  const store = useContext(StoreContext)
  const context = useMemo(
    () => ({
      config,
      store
    }),
    [config, store]
  )

  return context
}
