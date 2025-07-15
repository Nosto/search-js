import { useInjectionLogic } from "../../contexts/InfiniteScrollContext"
import { SearchInjected } from "./SearchInjected"
import { SearchNative } from "./SearchNative"

export function Search() {
  const { isInjectionEnabled } = useInjectionLogic()

  return isInjectionEnabled ? <SearchInjected /> : <SearchNative />
}
