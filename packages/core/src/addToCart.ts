import { addSkuToCart, nostojs } from "@nosto/nosto-js"
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
  await addSkuToCart(hit, undefined, quantity)
  await nostojs(async api => await api.recordSearchAddToCart(type, hit))
}
