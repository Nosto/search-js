import { SearchOptions, SearchProduct, SearchResult } from "@nosto/nosto-js/client"

export type HitDecorator<O extends SearchProduct = SearchProduct> = (hit: SearchProduct) => O

export type Options<HD extends HitDecorator[]> = SearchOptions & {
  /**
   * Hit decorators to apply to the search results.
   */
  hitDecorators?: HD
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never

export type DecoratedProduct<HD extends HitDecorator[]> = SearchProduct & ToIntersection<ReturnType<HD[number]>>

export type DecoratedResult<HD extends HitDecorator[]> = Omit<SearchResult, "products"> & {
  products: SearchResult["products"] & {
    hits: DecoratedProduct<HD>[]
  }
}
