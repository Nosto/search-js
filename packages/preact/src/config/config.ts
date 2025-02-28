import { Options as SearchConfig } from "@core/types"
import type { SearchQuery } from "@nosto/nosto-js/client"
import { PageType } from "@preact/api/types"

export type Config = SerpConfig | CategoryConfig | AutocompleteConfig | UnknownConfig
export type ValidConfig = SerpConfig | CategoryConfig | AutocompleteConfig

export const defaultConfig = {
  defaultCurrency: "EUR",
  queryModifications: query => query
} satisfies Omit<BaseConfig, "merchant">

export interface BaseConfig {
  /**
   * Merchant ID.
   */
  merchant: string
  /**
   * Merchant's default Currency.
   */
  defaultCurrency: string

  /**
   * Configuration for the search queries
   */
  search?: SearchConfig

  /**
   * Custom function, when provided, can be used to modify search query before sending it to the server.
   * A default implementation is provided in the config that returns the query without any modification.
   * Note: The query parameter itself should not be touched, but instead a new object should be returned in case modifications are needed.
   * @param query SearchQuery
   * @param pageType PageType | undefined
   * @default queryModifications: query => query
   * @example
   * ```
   * (query, pageType) => {
   *   return {
   *     ...query,
   *     products: {
   *       ...query.products,
   *       filter: [
   *         ...(query.products?.filter ?? []),
   *         { field: "availability", value: ["InStock"] }
   *       ]
   *     }
   *   }
   * }
   * ```
   */
  queryModifications: (query: SearchQuery, pageType: PageType | undefined) => SearchQuery
}

export interface SerpConfig extends BaseConfig {
  pageType: "search"
  /**
   * Enable persistent caching for search results.
   *
   * If enabled, the search results will be restored from cache when returning to the search page,
   * from example, from a product page.
   *
   * The cache is stored in the browser's session storage.
   */
  persistentSearchCache?: boolean

  /**
   * Preserve page scroll position when navigating back to search page.
   *
   * If enabled, it's highly recommended to also enabled `persistentSearchCache` for best user experience.
   */
  preservePageScroll?: boolean
}

export interface CategoryConfig extends BaseConfig {
  pageType: "category"
  /**
   * returns current category id
   */
  categoryId: () => string
  /**
   * returns current category path
   */
  categoryPath: () => string
  /**
   * Enable persistent caching for search results.
   *
   * If enabled, the search results will be restored from cache when returning to the search page,
   * from example, from a product page.
   *
   * The cache is stored in the browser's session storage.
   */
  persistentSearchCache?: boolean

  /**
   * Preserve page scroll position when navigating back to search page.
   *
   * If enabled, it's highly recommended to also enabled `persistentSearchCache` for best user experience.
   */
  preservePageScroll?: boolean
}

export interface AutocompleteConfig extends BaseConfig {
  pageType: "autocomplete"
}

export interface UnknownConfig {
  pageType: "unknown"
}
