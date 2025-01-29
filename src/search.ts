import { nostojs } from "@nosto/nosto-js"
import { SearchProduct, SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { HitDecorator, Options, DecoratedProduct, DecoratedResult } from "./types"

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
