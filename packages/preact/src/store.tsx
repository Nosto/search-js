import type { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { deepFreeze } from "@utils/deepFreeze"
import { deepMerge } from "@utils/deepMerge"
import { isEqual } from "@utils/isEqual"

import { PageType } from "./api/types"

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
   * Displays which page type it is - category | search
   */
  pageType: PageType | undefined
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
  pageType: undefined,
  query: {
    query: ""
  },
  response: {
    query: ""
  },
  initialized: false
}

export function createStore(overrides: Partial<State> = {}) {
  const changeCallbacks: Map<(piece: never) => void, (state: State) => void> = new Map()
  let state: State = overrides ? deepMerge(defaultState, overrides) : defaultState
  const initialState = deepFreeze(state)

  function setState(newState: (prevState: State) => State) {
    state = newState(state)
    for (const callback of changeCallbacks.values()) {
      callback(state)
    }
  }

  function updateState(newState: Partial<State>) {
    setState(prevState => {
      return { ...prevState, ...newState }
    })
  }

  function getState() {
    return state
  }

  function getInitialState() {
    return initialState
  }

  function onChange<T>(selector: (state: State) => T, callback: (piece: T) => void) {
    let lastValue: T | undefined

    changeCallbacks.set(callback, newState => {
      const piece = selector(newState)
      if (!isEqual(piece, lastValue)) {
        lastValue = piece
        callback(piece)
      }
    })
  }

  function clearOnChange<T>(callback: (piece: T) => void) {
    changeCallbacks.delete(callback)
  }

  return {
    updateState,
    getState,
    getInitialState,
    onChange,
    clearOnChange
  }
}

export type Store = ReturnType<typeof createStore>
