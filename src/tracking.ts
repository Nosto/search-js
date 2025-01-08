import { nostojs } from "@nosto/nosto-js"
import { SearchHit, SearchTrackOptions } from "@nosto/nosto-js/client"

/**
 * Record search submit event (e.g. search form submit). Required to track organic searches.
 */
export function recordSearchSubmit(query: string) {
  nostojs(api => api.recordSearchSubmit(query))
}

/**
 * Record search click event
 */
export function recordSearchClick(query: SearchTrackOptions, product: SearchHit) {
  nostojs(api => api.recordSearchClick(query, product))
}
