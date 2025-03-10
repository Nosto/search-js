const scrollPosStorageKey = "nosto:search:scrollPos"

export function savePageScroll() {
  window.sessionStorage.setItem(scrollPosStorageKey, window.scrollY.toString())
}

export function restoreSavedScroll() {
  const savedScrollPosition = window.sessionStorage.getItem(scrollPosStorageKey)
  if (!savedScrollPosition) {
    return
  }

  const scrollTo = Math.floor(parseFloat(savedScrollPosition))
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
    console.warn("Scroll position couldn't be restored in 5 seconds, something may be wrong.")
  }, 5000)
}
