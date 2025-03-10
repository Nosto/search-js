import { SearchOptions, SearchProduct, SearchResult } from "@nosto/nosto-js/client"

export type Options<HD extends readonly HitDecorator[] = readonly HitDecorator[]> = SearchOptions & {
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
}

export type HitDecorator = (hit: SearchProduct) => SearchProduct

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never

export type DecoratedProduct<HD extends readonly HitDecorator[]> = ToIntersection<ReturnType<HD[number]>>

export type DecoratedResult<HD extends readonly HitDecorator[]> = Omit<SearchResult, "products"> & {
  products: SearchResult["products"] & {
    hits: DecoratedProduct<HD>[]
  }
}
