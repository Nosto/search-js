import { SearchOptions } from "@core/types"
import { SearchQuery } from "@nosto/nosto-js/client"
import { ActionContext } from "@preact/actions/types"
import { PageType } from "@preact/api/types"

export const defaultBaseConfig = {
  defaultCurrency: "EUR",
  queryModifications: query => query
} satisfies Partial<BaseConfig>

export interface BaseConfig {
  /**
   * Merchant's default Currency.
   */
  defaultCurrency: string

  /**
   * Configuration for the search queries
   */
  search?: SearchOptions

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

  /**
   * Custom callback invoked before the search query is executed.
   *
   * To cancel the search action, throw an error in this callback.
   *
   * @param context The action context containing the store and config.
   * @param options The search options that would be used for the query.
   */
  onBeforeSearch?: (context: ActionContext, options: SearchOptions) => void

  /**
   * Custom error handler for search errors.
   *
   * @param error The error object that occurred during the search operation. This can be of any type.
   * @param query The search query that was being executed when the error occurred.
   * @param options The search options that were used for the query.
   */
  onSearchError?: (error: unknown, query: SearchQuery, options: SearchOptions, pageType: PageType) => void
}
