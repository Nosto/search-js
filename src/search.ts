import { nostojs } from "@nosto/nosto-js"
import { SearchOptions, SearchProduct, SearchQuery, SearchResult } from "@nosto/nosto-js/client"

export type Options<HD extends HitDecorator[]> = SearchOptions & {
  /**
   * Hit decorators to apply to the search results.
   */
  hitDecorators?: HD
}

export type HitDecorator = (hit: SearchProduct) => SearchProduct

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never

type DecoratedProduct<HD extends HitDecorator[]> = ToIntersection<ReturnType<HD[number]>>

export type DecoratedResult<HD extends HitDecorator[]> = Omit<SearchResult, "products"> & {
  products: SearchResult["products"] & {
    hits: DecoratedProduct<HD>[]
  }
}

/**
 * Performs a search operation using the provided query and options.
 *
 * @param query - The search query to be executed.
 * @param options - An object containing optional parameters for the search.
 * @returns A promise that resolves to the search result.
 */
export async function search<HD extends HitDecorator[]>(query: SearchQuery, options: Options<HD> = {}) {
  const { hitDecorators, ...rest } = options
  const api = await new Promise(nostojs)
  return applyDecorators(await api.search(query, rest), hitDecorators)
}

function applyDecorators<HD extends HitDecorator[]>(response: SearchResult, decorators?: HD) {
  if (!response.products || !decorators?.length) {
    return response as DecoratedResult<HD>
  }
  const decorator = (product: SearchProduct) => {
    return decorators.reduce((acc, decorator) => {
      return decorator(acc)
    }, product) as DecoratedProduct<HD>
  }

  return {
    ...response,
    products: {
      ...response.products,
      hits: response.products.hits.map(decorator)
    }
  }
}
