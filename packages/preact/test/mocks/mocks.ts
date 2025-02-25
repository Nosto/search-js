import { createStore, State } from "@preact/store"

export function mockStore(state: Partial<State>) {
  return createStore(state)
}
