import { nostojs } from "@nosto/nosto-js"
import { SearchHit, SearchTrackOptions } from "@nosto/nosto-js/client"

export type SearchHitWithSku = SearchHit & { skuId: string }

/**
 * Adds a search hit to the cart.
 *
 * @param type - The type of search that the hit belongs to.
 * @param hit - The search hit to add to the cart.
 * @param quantity - The quantity of the hit to add to the cart.
 */
export async function addToCart(type: SearchTrackOptions, hit: SearchHitWithSku, quantity = 1) {
  if (!window.Nosto?.addSkuToCart) {
    throw new Error("window.Nosto.addSkuToCart is not available")
  }
  await window.Nosto.addSkuToCart(hit, undefined, quantity)
  await nostojs(async api => await api.recordSearchAddToCart(type, hit))
}
