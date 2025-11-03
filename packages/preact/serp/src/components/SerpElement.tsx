import { nostojs } from "@nosto/nosto-js"
import { SearchHit } from "@nosto/nosto-js/client"
import { ProductHit } from "@preact/autocomplete/types"
import { AsComponent, BaseElement, BaseElementProps } from "@preact/common/components/BaseElement"
import { useConfig } from "@preact/common/config/configContext"
import { savePageScroll } from "@utils/savePageScroll"
import { useCallback } from "preact/hooks"

/**
 * @group Components
 */
export type SerpElementProps<C extends AsComponent> = Omit<BaseElementProps<C>, "onClick"> & {
  hit: ProductHit
}

/**
 * Wrapper component that can be used to wrap any element in the search result list.
 *
 * @group Components
 */
export function SerpElement<C extends AsComponent>({ children, hit, componentProps, as }: SerpElementProps<C>) {
  const { pageType } = useConfig()
  const track = pageType === "autocomplete" ? undefined : pageType === "search" ? "serp" : pageType

  const onClick = useCallback(() => {
    if (hit && track) {
      nostojs(api => api.recordSearchClick(track, hit as SearchHit))
    }
    savePageScroll()
  }, [hit, track])

  return (
    <BaseElement as={as} onClick={onClick} componentProps={componentProps}>
      {children}
    </BaseElement>
  )
}
