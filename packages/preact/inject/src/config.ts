import { SearchQuery } from "@nosto/nosto-js/client"
import { AutocompleteConfig, PublicAutocompleteConfig } from "@preact/autocomplete/AutocompleteConfig"
import { CategoryConfig, PublicCategoryConfig } from "@preact/category/CategoryConfig"
import { PublicSerpConfig, SerpConfig } from "@preact/serp/SerpConfig"
import { VNode } from "preact"

import { CssSelector } from "./resolveCssSelector"

export type PublicAutocompleteInjectConfig = {
  /**
   * Configuration passthrough.
   */
  config: PublicAutocompleteConfig

  /**
   * Query to be used for autocomplete.
   */
  query?: SearchQuery

  /**
   * Maximum time (in milliseconds) to wait for the DOM to be available.
   * If a selector is unable to find any elements after the timeout, an error will be thrown.
   * @default 100
   */
  timeout?: number

  /**
   * CSS selector for the form element to bind search events like form submit.
   */
  formCssSelector: CssSelector
  /**
   * CSS selector for each input element to bind search events like input change and form submit.
   */
  inputCssSelector: CssSelector
  /**
   * CSS selector for autocomplete dropdown render.
   * Leave undefined for default use (After input element)
   */
  dropdownCssSelector: CssSelector

  /**
   * Render function for autocomplete component.
   */
  renderAutocomplete?: () => VNode | Promise<VNode>

  /**
   * Render function for autocomplete history component.
   */
  renderHistory?: () => VNode | Promise<VNode>

  /**
   * Render function for speech to text component.
   */
  renderSpeechToText?: () => VNode | Promise<VNode>

  /**
   * If provided, will be called on search submit or "show all products" click.
   */
  onNavigateToSearch?: (query: SearchQuery) => void
}

export type AutocompleteInjectConfig = PublicAutocompleteInjectConfig & {
  config: AutocompleteConfig
}

export type PublicCategoryInjectConfig = {
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

export type CategoryInjectConfig = PublicCategoryInjectConfig & {
  config: CategoryConfig
}

export type PublicSerpInjectConfig = {
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

export type SerpInjectConfig = PublicSerpInjectConfig & {
  config: SerpConfig
}

export type InitConfig = {
  /**
   * Autocomplete injection config.
   * If present, the autocomplete dropdown will be injected into the page.
   */
  autocomplete?: PublicAutocompleteInjectConfig

  /**
   * Category injection config.
   * If present, the category page will be injected.
   */
  category?: PublicCategoryInjectConfig

  /**
   * Serp injection config.
   * If present, the search result page will be injected.
   */
  serp?: PublicSerpInjectConfig
}
