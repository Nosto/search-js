import { SearchOptions, SearchProduct, SearchQuery, SearchResult } from "@nosto/nosto-js/client"

export type Options<HD extends HitDecorator[] = HitDecorator[]> = SearchOptions & {
  /**
   * Hit decorators to apply to the search results.
   */
  hitDecorators?: HD
  /**
   * Maximum number of retry attempts. Default: 0 (no retries).
   */
  maxRetries?: number
  /**
   * Interval (in ms) between retry attempts. Default: 1000 ms.
   */
  retryInterval?: number
  /**
   * Enable search fallback when service is unavailable and retries are exhausted.
   * By default, if the fallback is not defined, the search operation will throw an error in this case.
   *
   * If your fallback involves a redirect, make sure to avoid redirecting to a page with Nosto search enabled.
   *
   * @example
   * ```
   * import { SearchQuery } from "@nosto/nosto-js/client"
   *
   * ...
   *
   * fallback: (query: SearchQuery) => {
   *  location.replace(`/search?q=${query.query}`)
   * }
   * ```
   */
  fallback?: (query: SearchQuery) => void
}

export type HitDecorator = (hit: SearchProduct) => SearchProduct

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never

export type DecoratedProduct<HD extends HitDecorator[]> = ToIntersection<ReturnType<HD[number]>>

export type DecoratedResult<HD extends HitDecorator[]> = Omit<SearchResult, "products"> & {
  products: SearchResult["products"] & {
    hits: DecoratedProduct<HD>[]
  }
}
