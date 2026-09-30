import { useConfig } from "@preact/common/config/configContext"
import { StoreContext } from "@preact/common/store/storeContext"
import { savePageScroll } from "@utils/pageScroll/savePageScroll"
import { useCallback, useContext, useEffect } from "preact/hooks"

/**
 * Saves the page scroll position and the loaded product count when leaving the page
 */
export function PageHideListener() {
  const config = useConfig()
  const store = useContext(StoreContext)
  const preservePageScroll = config.pageType !== "autocomplete" && config.preservePageScroll

  const onPageHide = useCallback(() => {
    savePageScroll(store.getState().query.products?.size)
  }, [store])

  useEffect(() => {
    if (!preservePageScroll) {
      return
    }
    window.addEventListener("pagehide", onPageHide)
    return () => window.removeEventListener("pagehide", onPageHide)
  }, [onPageHide, preservePageScroll])

  return null
}
