import type { SearchQuery, SearchResult } from "@nosto/nosto-js/client"

import { createExtendableStore } from "./storeExtensions"

/**
 * Preact state includes all changing variables of the app.
 * After each change page is automatically rerendered.
 * State includes user input, output and other useful things.
 */
export interface State {
  /**
   * Indicates that the search is loading, loader should be shown when `true`.
   */
  loading: boolean
  /**
   * Current search query that includes all user input like search text, filters, sort, page, etc.
   */
  query: SearchQuery
  /**
   * Current search response that includes found products, keywords and other results.
   */
  response: SearchResult
  /**
   * Indicates that preact app is initialized.
   */
  initialized: boolean
  /**
   * History items
   */
  historyItems?: string[]
}

export const defaultState: State = {
  loading: true,
  query: {},
  response: {},
  initialized: false
}

/**
 * Create a standard Nosto store to manage the state of the app.
 *
 * If you use Nosto providers, you don't need to create a store manually.
 * @param overrides Initial state overrides.
 */
export function createStore(overrides: Partial<State> = {}) {
  return createExtendableStore(defaultState, overrides)
}

export type Store = ReturnType<typeof createStore>
