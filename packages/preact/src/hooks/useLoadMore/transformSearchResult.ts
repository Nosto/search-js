import { SearchResult } from "@nosto/nosto-js/client"
import { mergeArrays } from "@utils/mergeArrays"

/**
 * Strictly for internal purpose only and not to be exported for public use.
 * Search result is paginated when using infinite scrolling.
 * This function merges the product hits from current pagination request with the previous one.
 */
export function mergeProductHits(...results: SearchResult[]): SearchResult {
  const mergedResult = results.reduce((acc, result) => {
    if (!acc.products?.hits.length) {
      return result
    }

    const { products, ...rest } = result

    if (!products?.hits?.length) {
      return {
        ...acc,
        ...rest,
        products: {
          ...(products ?? acc.products),
          hits: acc.products?.hits ?? []
        }
      }
    }

    return {
      ...acc,
      ...rest,
      products: {
        ...products,
        hits: mergeArrays(acc.products?.hits ?? [], products.hits)
      }
    }
  }, {})

  return mergedResult
}
