import * as useActions from "@preact/hooks/useActions"
import { createStore, State } from "@preact/store"
import { deepMerge } from "@utils/deepMerge"
import { Unfreeze } from "@utils/types"
import { vi } from "vitest"

export function mockStore(state: Partial<State>) {
  return createStore(state)
}

export function resetStore(store: ReturnType<typeof createStore>) {
  store.updateState(deepMerge(store.getInitialState()) as Unfreeze<State>)
}

export function mockActions() {
  const actions = {
    newSearch: vi.fn(),
    updateSearch: vi.fn(),
    toggleProductFilter: vi.fn(),
    replaceFilter: vi.fn()
  }
  vi.spyOn(useActions, "useActions").mockImplementation(() => actions)
  return actions
}
