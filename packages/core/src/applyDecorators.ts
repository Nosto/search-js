import { SearchProduct, SearchQuery } from "@nosto/nosto-js/client"

import { DecoratedProduct, DecoratedResult, HitDecorator, SearchFn, SearchOptions } from "./types"

export async function applyDecorators<HD extends readonly HitDecorator[]>(
  query: SearchQuery,
  { hitDecorators, ...options }: SearchOptions<HD>,
  searchFn: SearchFn
): Promise<DecoratedResult<HD>> {
  const response = await searchFn(query, options)
  if (!response.products?.hits?.length || !hitDecorators?.length) {
    return response as DecoratedResult<HD>
  }
  // eslint-disable-next-line func-style
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
