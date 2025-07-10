import { useInjectionLogic } from "../../contexts/InfiniteScrollContext"
import { AutocompleteInjected } from "./AutocompleteInjected"
import { AutocompleteNative } from "./AutocompleteNative"

export function Autocomplete() {
  const { isInjectionEnabled } = useInjectionLogic()

  return isInjectionEnabled ? <AutocompleteInjected /> : <AutocompleteNative />
}
