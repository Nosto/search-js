import { createStore, State } from "@preact/common/store/store"
import { deepMerge } from "@utils/deepMerge"
import { Unfreeze } from "@utils/types"

export function mockStore(state: Partial<State>) {
  return createStore(state)
}

export function resetStore(store: ReturnType<typeof createStore>) {
  store.updateState(deepMerge(store.getInitialState()) as Unfreeze<State>)
}
