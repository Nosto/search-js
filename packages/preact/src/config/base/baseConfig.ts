import { Options as SearchConfig } from "@core/types"
import { SearchQuery } from "@nosto/nosto-js/client"
import { PageType } from "@preact/api/types"

export const defaultBaseConfig = {
  defaultCurrency: "EUR",
  queryModifications: query => query
} satisfies Partial<BaseConfig>

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
