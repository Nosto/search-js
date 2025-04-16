import { SearchResult } from "@nosto/nosto-js/client"
import { mergeArrays } from "@utils/mergeArrays"

export type SearchResultTransformer = (props: SearchResult) => SearchResult

export type MergePaginatedProductResultOptions = {
  newResult: SearchResult
  previousResult: SearchResult
}

/**
 *
 * @param param0
 * @returns
 */
export function mergePaginatedProductResultIfNeeded({ newResult, previousResult }: MergePaginatedProductResultOptions) {
  if (!previousResult?.products?.hits.length) {
    return newResult
  }

  const { products, ...rest } = newResult

  if (!products?.hits?.length) {
    return {
      ...rest,
      products: {
        ...products,
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
