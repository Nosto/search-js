import { SavedScroll } from "./savedScrollSchema"

export const scrollPosStorageKey = "nosto:search-js:scrollPos"

export function savePageScroll(productCount?: number) {
  const savedScroll: SavedScroll = {
    url: window.location.href,
    scrollY: window.scrollY,
    productCount
  }
  window.sessionStorage.setItem(scrollPosStorageKey, JSON.stringify(savedScroll))
}
