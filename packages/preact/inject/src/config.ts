import { PublicAutocompleteConfig } from "@preact/autocomplete/AutocompleteConfig"
import { PublicCategoryConfig } from "@preact/category/CategoryConfig"
import { PublicSerpConfig } from "@preact/serp/SerpConfig"
import { VNode } from "preact"

import { CssSelector } from "./resolveCssSelector"

export type AutocompleteInjectConfig = {
  /**
   * Configuration passthrough.
   */
  config: PublicAutocompleteConfig

  /**
   * CSS selector for each input element to bind search events like input change and form submit.
   */
  inputSelector: CssSelector
  /**
   * CSS selector for autocomplete dropdown render.
   * Leave undefined for default use (After input element)
   */
  dropdownSelector: CssSelector
}

export type CategoryInjectConfig = {
  /**
   * Configuration passthrough.
   */
  config: PublicCategoryConfig

  /**
   * CSS selector for category content rendering.
   */
  cssSelector: CssSelector

  /**
   * Render function for category content.
   */
  render: () => VNode | Promise<VNode>
}

export type SerpInjectConfig = {
  /**
   * Configuration passthrough.
   */
  config: PublicSerpConfig

  /**
   * CSS selector for search page rendering.
   */
  cssSelector: CssSelector

  /**
   * Render function for search page content.
   */
  render: () => VNode | Promise<VNode>
}

export type InitConfig = {
  /**
   * Autocomplete injection config.
   * If present, the autocomplete dropdown will be injected into the page.
   */
  autocomplete?: AutocompleteInjectConfig

  /**
   * Category injection config.
   * If present, the category page will be injected.
   */
  category?: CategoryInjectConfig

  /**
   * Serp injection config.
   * If present, the search result page will be injected.
   */
  serp?: SerpInjectConfig
}
