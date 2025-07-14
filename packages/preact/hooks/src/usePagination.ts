import { range } from "@utils/range"
import { useMemo } from "preact/hooks"

import { useNostoAppState } from "./useNostoAppState"

/**
 * Pagination page type.
 */
export type Page = {
  from: number
  page: number
  current: boolean
}

/**
 * Preact hook that import pagination state to the component.
 *
 * **Should always be at the top of the component!**
 *
 * @example
 * ```jsx
 * import { usePagination } from '@nosto/search-js/preact/hooks'
 *
 * export default () => {
 *     const { pages } = usePagination()
 *
 *     return pages.map((page) => <li>
 *         {page.current ? <span>{page.page}</span> : <a>
 *             {page.page}
 *         </a>}
 *     </li>)
 * }
 * ```
 *
 * @group Hooks
 */
export function usePagination(options?: { width?: number }): {
  totalPages: number
  resultsFrom: number
  resultsTo: number
  current?: Page
  prev?: Page
  next?: Page
  first?: Page
  last?: Page
  pages: Page[]
} {
  const { query, products } = useNostoAppState(state => ({
    query: state.query,
    products: state.response.products
  }))

  return useMemo(() => {
    if (!products) {
      return {
        totalPages: 0,
        resultsFrom: 0,
        resultsTo: 0,
        pages: []
      }
    }

    const from = query.products?.from ?? 0
    const width = options?.width ?? Infinity

    const pagesToShow = Math.max(Math.floor(width - 1) / 2, 1)
    const currentPage = products.size! > 0 ? Math.floor(from / products.size!) + 1 : 1
    const totalPages = products.size! > 0 ? Math.ceil(products.total / products.size!) : 0

    const showPage = (page: number) => page >= currentPage - pagesToShow && page <= currentPage + pagesToShow

    const resultsFrom = from + 1
    const resultsTo = Math.min(from + products.total, products.total)
    const current: Page = {
      from,
      page: currentPage,
      current: true
    }

    const pageToPosition = (page: number) => {
      return {
        from: (page - 1) * products.size!,
        page,
        current: page === currentPage
      }
    }

    const prev = currentPage > 1 ? pageToPosition(currentPage - 1) : undefined
    const next = currentPage < totalPages ? pageToPosition(currentPage + 1) : undefined
    const first = currentPage - pagesToShow - 1 > 1 ? pageToPosition(1) : undefined
    const last = currentPage + pagesToShow + 1 < totalPages ? pageToPosition(totalPages) : undefined
    const pages = range(1, totalPages + 1)
      .filter(showPage)
      .map(pageToPosition)

    if (!first && pages[0]?.page === 2) {
      // add first page to extended pages array
      pages.unshift(pageToPosition(1))
    }
    if (!last && pages[pages.length - 1]?.page === totalPages - 1) {
      // add last page to extended pages array
      pages.push(pageToPosition(totalPages))
    }

    return {
      totalPages,
      resultsFrom,
      resultsTo,
      current,
      prev,
      next,
      first,
      last,
      pages
    }
  }, [query, products, options?.width])
}
