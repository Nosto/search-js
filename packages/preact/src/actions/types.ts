import { Config } from "@preact/config/config"
import { Store } from "@preact/store"

export type ActionContext = {
  store: Store
  config: Config
}
