import { SearchResult } from "@nosto/nosto-js/client"
import { mergeArrays } from "@utils/mergeArrays"

export type SearchResultTransformer = (props: SearchResult) => SearchResult

export type MergeProductHitsOptions = {
  newResult: SearchResult
  previousResult: SearchResult
}

/**
 * Strictly for internal purpose only and not to be exported for public use.
 * Search result is paginated when using infinite scrolling.
 * This function merges the product hits from current pagination request with the previous one.
 */
export function mergeProductHits({ newResult, previousResult }: MergeProductHitsOptions) {
  if (!previousResult.products?.hits.length) {
    return newResult
  }

  const { products, ...rest } = newResult

  if (!products?.hits?.length) {
    return {
      ...rest,
      products: {
        ...(products ?? previousResult.products),
        hits: previousResult.products.hits
      }
    }
  }

  return {
    ...rest,
    products: {
      ...products,
      hits: mergeArrays(previousResult.products.hits, products.hits)
    }
  }
}
