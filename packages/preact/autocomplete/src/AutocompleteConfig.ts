import { BaseConfig, defaultBaseConfig } from "@preact/common/config/baseConfig"

export const defaultAutocompleteConfig = {
  ...defaultBaseConfig,
  memoryCache: false
} satisfies Partial<AutocompleteConfig>

export interface AutocompleteConfig extends BaseConfig {
  pageType: "autocomplete"
  /**
   * Enable in-memory caching
   */
  memoryCache: boolean
}

export type PublicAutocompleteConfig = Omit<AutocompleteConfig, keyof typeof defaultAutocompleteConfig | "pageType"> &
  Partial<Pick<AutocompleteConfig, keyof typeof defaultAutocompleteConfig>>

export function makeAutocompleteConfig(config: PublicAutocompleteConfig) {
  return {
    pageType: "autocomplete",
    ...defaultAutocompleteConfig,
    ...config
  } satisfies AutocompleteConfig
}
