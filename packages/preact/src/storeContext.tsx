import { ComponentChildren, createContext } from "preact"

import { createStore, Store } from "./store"

export const StoreContext = createContext<Store>(createStore({}))

type Props = {
  store: Store
  children: ComponentChildren
}

export function StoreProvider({ store, children }: Props) {
  return <StoreContext value={store}>{children}</StoreContext>
}
