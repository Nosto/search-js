import { BaseConfig, defaultBaseConfig } from "../../base/baseConfig"

export const defaultAutocompleteConfig = {
  ...defaultBaseConfig
} satisfies Partial<AutocompleteConfig>

export interface AutocompleteConfig extends BaseConfig {
  pageType: "autocomplete"
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
