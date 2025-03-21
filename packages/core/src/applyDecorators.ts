import { SearchProduct, SearchResult } from "@nosto/nosto-js/client"

import { DecoratedProduct, DecoratedResult, HitDecorator } from "./types"

export function applyDecorators<HD extends readonly HitDecorator[]>(response: SearchResult, decorators?: HD) {
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
