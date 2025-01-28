import { nostojs } from "@nosto/nosto-js"
import { SearchOptions, SearchProduct, SearchQuery, SearchResult } from "@nosto/nosto-js/client"

export type Options = SearchOptions & {
  /**
   * Hit decorators to apply to the search results.
   */
  hitDecorators?: HitDecorator[]
}

/**
 * Performs a search operation using the provided query and options.
 *
 * @param query - The search query to be executed.
 * @param options - An object containing optional parameters for the search.
 * @returns A promise that resolves to the search result.
 */
export async function search(query: SearchQuery, { hitDecorators, ...options }: Options = {}): Promise<SearchResult> {
  const api = await new Promise(nostojs)

  if (hitDecorators?.length) {
    return applyDecorators(await api.search(query, options), hitDecorators)
  }
  return await api.search(query, options)
}

export type HitDecorator = (hit: SearchProduct) => SearchProduct

function applyDecorators(response: SearchResult, decorators: HitDecorator[]) {
  if (!response.products) {
    return response
  }
  const decorator: HitDecorator = product => {
    return decorators.reduce((acc, decorator) => {
      return decorator(acc)
    }, product)
  }

  return {
    ...response,
    products: {
      ...response.products,
      hits: response.products.hits.map(decorator)
    }
  }
}
