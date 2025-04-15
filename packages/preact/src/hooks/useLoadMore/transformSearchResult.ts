import { SearchResult } from "@nosto/nosto-js/client"
import { mergeArrays } from "@utils/mergeArrays"

export type SearchResultTransformer = (props: SearchResult) => SearchResult

export type MergePaginatedProductResultOptions = {
    newResult: SearchResult
    previousResult: SearchResult
    optimizedScrolling?: boolean
}

export function mergePaginatedProductResultIfNeeded({ newResult, previousResult, optimizedScrolling }: MergePaginatedProductResultOptions) {
    if (optimizedScrolling && previousResult?.products?.hits.length) {
        const { products, ...rest } = newResult

        return {
            ...rest,
            products: products?.hits.length
                ? {
                      ...products,
                      hits: mergeArrays(products.hits, previousResult.products.hits)
                  }
                : previousResult.products
        } satisfies SearchResult
    }

    return newResult
}