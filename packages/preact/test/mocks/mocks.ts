import * as useActions from "@preact/hooks/useActions"
import { createStore, State } from "@preact/store"
import { vi } from "vitest"

export function mockStore(state: Partial<State>) {
  return createStore(state)
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
