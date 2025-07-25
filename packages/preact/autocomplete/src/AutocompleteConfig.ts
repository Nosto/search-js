import { BaseConfig, defaultBaseConfig } from "@preact/common/config/baseConfig"

export const defaultAutocompleteConfig = {
  ...defaultBaseConfig,
  memoryCache: false,
  historyEnabled: true,
  historySize: 5,
  debounceDelay: 500,
  minQueryLength: 2
} satisfies Partial<AutocompleteConfig>

export interface AutocompleteConfig extends BaseConfig {
  pageType: "autocomplete"
  /**
   * Enable in-memory caching
   */
  memoryCache: boolean

  /**
   * Enable history
   */
  historyEnabled: boolean

  /**
   * History size
   */
  historySize: number

  /**
   * Debounce delay in milliseconds
   */
  debounceDelay: number

  /**
   * Minimum query length to show autocomplete dropdown
   */
  minQueryLength: number
}

export type PublicAutocompleteConfig = Omit<AutocompleteConfig, keyof typeof defaultAutocompleteConfig | "pageType"> &
  Partial<Pick<AutocompleteConfig, keyof typeof defaultAutocompleteConfig>>

export function makeAutocompleteConfig(config: PublicAutocompleteConfig = {}) {
  return {
    pageType: "autocomplete",
    ...defaultAutocompleteConfig,
    ...config
  } satisfies AutocompleteConfig
}
