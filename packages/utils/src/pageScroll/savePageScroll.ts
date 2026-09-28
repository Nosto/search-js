import { SavedScroll } from "./savedScrollSchema"

export const scrollPosStorageKey = "nosto:search-js:scrollPos"

export function savePageScroll() {
  const savedScroll: SavedScroll = {
    url: window.location.href,
    scrollY: window.scrollY
  }
  window.sessionStorage.setItem(scrollPosStorageKey, JSON.stringify(savedScroll))
}
