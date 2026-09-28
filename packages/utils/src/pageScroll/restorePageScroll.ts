import { logger } from "@utils/logger"
import { is } from "valibot"

import { savedScrollSchema } from "./savedScrollSchema"
import { scrollPosStorageKey } from "./savePageScroll"

export function restoreSavedScroll() {
  const savedScrollPosition = window.sessionStorage.getItem(scrollPosStorageKey)
  if (!savedScrollPosition) {
    return
  }

  const savedScroll = JSON.parse(savedScrollPosition)
  if (!is(savedScrollSchema, savedScroll)) {
    return
  }
  // The position was saved on a different page
  if (savedScroll.url !== window.location.href) {
    return
  }

  const scrollTo = Math.floor(savedScroll.scrollY)
  const interval = window.setInterval(() => {
    const maxScrollable = document.documentElement.scrollHeight - window.innerHeight
    if (maxScrollable >= scrollTo) {
      window.scrollTo(0, scrollTo)
      window.sessionStorage.removeItem(scrollPosStorageKey)
      window.clearInterval(interval)
    }
  }, 10)

  /**
   * Defensive block in case scroll position couldn't be restored shortly after page load.
   */
  window.setTimeout(() => {
    window.clearInterval(interval)
    logger.warn("Scroll position couldn't be restored in 5 seconds, something may be wrong.")
  }, 5000)
}
