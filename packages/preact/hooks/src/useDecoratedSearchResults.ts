import { DecoratedProduct, DecoratedResult, HitDecorator } from "@core/types"
import { SearchProduct, SearchResult } from "@nosto/nosto-js/client"
import { isPlainObject } from "@utils/isPlainObject"

import { useNostoAppState } from "./useNostoAppState"

/**
 * Applies decorator types to provided products.
 * If value is not provided, returns the latest search results from the store instead.
 *
 * @example
 * ```jsx
 * import { useDecoratedSearchResults } from '@nosto/search-js/preact/hooks'
 * import { priceDecorator } from '@nosto/search-js/currencies'
 *
 * export default () => {
 *     const results = useDecoratedSearchResults<[typeof priceDecorator]>()
 *
 *     return (
 *       <div>
 *         List price is {results[0].listPriceText}
 *       </div>
 *     )
 * }
 * ```
 *
 * @group Hooks
 */
export function useDecoratedSearchResults<T extends readonly HitDecorator[]>(): DecoratedResult<T>
export function useDecoratedSearchResults<T extends readonly HitDecorator[]>(
  product: SearchProduct
): DecoratedProduct<T>
export function useDecoratedSearchResults<T extends readonly HitDecorator[]>(products: SearchResult): DecoratedResult<T>
export function useDecoratedSearchResults<T extends readonly HitDecorator[]>(products?: SearchProduct | SearchResult) {
  const state = useNostoAppState(state => state.response) as DecoratedResult<T>
  if (products && Array.isArray(products)) {
    return products as DecoratedProduct<T>
  } else if (products && isPlainObject(products)) {
    return products as DecoratedResult<T>
  }
  return state
}
