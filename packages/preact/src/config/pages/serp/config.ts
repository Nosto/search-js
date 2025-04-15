import { BaseConfig, defaultBaseConfig } from "../../base/baseConfig"

export const defaultSerpConfig = {
  ...defaultBaseConfig,
  persistentSearchCache: false,
  preservePageScroll: false
} satisfies Partial<SerpConfig>

export interface SerpConfig extends BaseConfig {
  pageType: "serp"
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

  /**
     * Infinite scroll option fetches the all the products and renders them on page every time it's triggered.
     * Using this option will override this default behavior and optimizes it to fetch and append only the next batch of products.
     */
  optimizedScrolling?: boolean
}

export type PublicSerpConfig = Omit<SerpConfig, keyof typeof defaultSerpConfig | "pageType"> &
  Partial<Pick<SerpConfig, keyof typeof defaultSerpConfig>>

export function makeSerpConfig(config: PublicSerpConfig = {}) {
  return {
    pageType: "serp",
    ...defaultSerpConfig,
    ...config
  } satisfies SerpConfig
}
