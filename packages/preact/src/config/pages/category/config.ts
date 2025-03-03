import { BaseConfig, defaultBaseConfig } from "../../base/baseConfig"

export const defaultCategoryConfig = {
  ...defaultBaseConfig,
  persistentSearchCache: false,
  preservePageScroll: false
} satisfies Partial<CategoryConfig>

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
   * for example, from a product page.
   *
   * The cache is stored in the browser's session storage.
   */
  persistentSearchCache: boolean

  /**
   * Preserve page scroll position when navigating back to search page.
   *
   * If enabled, it's highly recommended to also enabled `persistentSearchCache` for best user experience.
   */
  preservePageScroll: boolean
}

export type PublicCategoryConfig = Omit<CategoryConfig, keyof typeof defaultCategoryConfig | "pageType"> &
  Partial<Pick<CategoryConfig, keyof typeof defaultCategoryConfig>>

export function makeCategoryConfig(config: PublicCategoryConfig) {
  return {
    pageType: "category",
    ...defaultCategoryConfig,
    ...config
  } satisfies CategoryConfig
}
