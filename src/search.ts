import { nostojs } from "@nosto/nosto-js"
import { SearchProduct, SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { Options, HitDecorator, DecoratedResult, DecoratedProduct } from "./types"

/**
 * Performs a search operation using the provided query and options.
 *
 * @param query - The search query to be executed.
 * @param options - An object containing optional parameters for the search.
 * @param options.hitDecorators - An optional array of decorators to be applied to the search results.
 * @returns A promise that resolves to the search result.
 */
export async function search<HD extends HitDecorator[]>(
  query: SearchQuery,
  { hitDecorators, ...options }: Options<HD> = {}
): Promise<DecoratedResult<HD>> {
  const api = await new Promise(nostojs)

  if (hitDecorators?.length) {
    return applyDecorators(await api.search(query, options), hitDecorators)
  }
  return (await api.search(query, options)) as DecoratedResult<HD>
}

function applyDecorators<HD extends HitDecorator[]>(response: SearchResult, decorators: HD): DecoratedResult<HD> {
  if (!response.products) {
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
