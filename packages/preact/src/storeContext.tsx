import { createContext } from "preact"

import { createStore, Store } from "./store"

export const StoreContext = createContext<Store>(createStore())
