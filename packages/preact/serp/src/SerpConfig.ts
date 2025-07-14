import { BaseConfig, defaultBaseConfig } from "@preact/common/config/baseConfig"

export const defaultSerpConfig = {
  ...defaultBaseConfig,
  persistentSearchCache: false,
  preservePageScroll: false
} satisfies Partial<SerpConfig>

export interface SerpConfig extends BaseConfig {
  pageType: "search"
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

export type PublicSerpConfig = Omit<SerpConfig, keyof typeof defaultSerpConfig | "pageType"> &
  Partial<Pick<SerpConfig, keyof typeof defaultSerpConfig>>

export function makeSerpConfig(config: PublicSerpConfig = {}) {
  return {
    pageType: "search",
    ...defaultSerpConfig,
    ...config
  } satisfies SerpConfig
}
