import { deepMergePlain } from "@utils/deepMerge"
import { isEqual } from "@utils/isEqual"

import { State as BaseState } from "./store"

/**
 * Create an extendable Nosto store with any state object.
 * @param defaultState Default state object.
 * @param overrides Initial state overrides.
 *
 * While not as powerful as established store management libraries, Nosto store is a viable way to manage state in your app.
 * This store may be useful for smaller deployments or when you want to avoid the complexity of a larger library.
 */
export function createExtendableStore<State extends BaseState>(defaultState: State, overrides: Partial<State> = {}) {
  const changeCallbacks: Map<(piece: never) => void, (state: State) => void> = new Map()
  let state = deepMergePlain(defaultState, overrides ?? {}) as State
  const initialState = deepMergePlain(defaultState, overrides) as State

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
    return structuredClone(initialState)
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

export type ExtendedStore<T extends BaseState> = ReturnType<typeof createExtendableStore<T>>
