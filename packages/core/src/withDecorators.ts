import { SearchProduct, SearchQuery } from "@nosto/nosto-js/client"

import { DecoratedProduct, DecoratedResult, HitDecorator, SearchFn, SearchOptions } from "./types"

export async function searchWithDecorators<HD extends readonly HitDecorator[]>(
  query: SearchQuery,
  { hitDecorators, ...options }: SearchOptions<HD>,
  next: SearchFn<HD>
): Promise<DecoratedResult<HD>> {
  const response = await next(query, options)
  if (!response.products?.hits?.length || !hitDecorators?.length) {
    return response as DecoratedResult<HD>
  }
  const decorator = (product: SearchProduct) => {
    return hitDecorators.reduce((acc, decorator) => {
      return decorator(acc)
    }, product) as DecoratedProduct<HD>
  }

  return {
    ...response,
    products: {
      ...response.products,
      hits: response.products.hits.map(decorator)
    }
  } as DecoratedResult<HD>
}
