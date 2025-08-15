import { useInjectionLogic } from "../../contexts/InfiniteScrollContext"
import { CategoryInject } from "./CategoryInjected"
import { CategoryNative } from "./CategoryNative"

export function Category() {
  const { isInjectionEnabled } = useInjectionLogic()

  return isInjectionEnabled ? <CategoryInject /> : <CategoryNative />
}
