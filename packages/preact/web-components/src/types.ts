import { AutocompleteConfig } from "@preact/autocomplete/AutocompleteConfig"
import { CategoryConfig } from "@preact/category/CategoryConfig"
import { SerpConfig } from "@preact/serp/SerpConfig"

export interface NostoWebComponentConfig {
  /**
   * Nosto account ID
   */
  accountId: string
  
  /**
   * Default currency for formatting prices
   */
  defaultCurrency?: string
  
  /**
   * Search endpoint URL
   */
  searchUrl?: string
  
  /**
   * Additional search configuration
   */
  search?: {
    products?: {
      limit?: number
      fields?: string[]
    }
    redirect?: boolean
  }
}

export type PageConfig = SerpConfig | CategoryConfig | AutocompleteConfig

/**
 * Event names used for inter-component communication
 */
export const NOSTO_EVENTS = {
  SEARCH: "nosto:search-js/search",
  FILTER_CHANGE: "nosto:search-js/filter-change", 
  SORT_CHANGE: "nosto:search-js/sort-change",
  PAGE_CHANGE: "nosto:search-js/page-change",
  RESULTS_UPDATED: "nosto:search-js/results-updated",
  AUTOCOMPLETE_SELECT: "nosto:search-js/autocomplete-select"
} as const

export type NostoEventType = typeof NOSTO_EVENTS[keyof typeof NOSTO_EVENTS]

/**
 * Event detail interfaces
 */
export interface SearchEventDetail {
  query: string
  filters?: Record<string, unknown>
  sort?: string
  page?: number
}

export interface FilterChangeEventDetail {
  field: string
  value: string | string[]
  active: boolean
}

export interface SortChangeEventDetail {
  sort: string
}

export interface PageChangeEventDetail {
  page: number
}

export interface ResultsUpdatedEventDetail {
  results: unknown[]
  total: number
  page: number
  facets?: unknown[]
}

export interface AutocompleteSelectEventDetail {
  query?: string
  hit?: unknown
}