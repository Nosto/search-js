import { PublicCategoryConfig } from "@preact/category/CategoryConfig"
import { VNode } from "preact"

import { CssSelector } from "./resolveCssSelector"

export type AutocompleteInjectConfig = {
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

export type CategoryInjectConfig = PublicCategoryConfig & {
  /**
   * CSS selector for category content rendering.
   */
  categorySelector: CssSelector

  /**
   * Render function for category content.
   */
  render: () => VNode | Promise<VNode>
}

export type SerpInjectConfig = {
  /**
   * CSS selector for search page rendering.
   */
  contentSelector: CssSelector
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
