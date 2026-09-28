import { nostojs } from "@nosto/nosto-js"
import { SearchHit } from "@nosto/nosto-js/client"
import { ProductHit } from "@preact/autocomplete/types"
import { AsComponent, BaseElement, BaseElementProps } from "@preact/common/components/BaseElement"
import { useConfig } from "@preact/common/config/configContext"
import { savePageScroll } from "@utils/pageScroll/savePageScroll"
import { useCallback } from "preact/hooks"

/**
 * @group Components
 */
export type SerpElementProps<C extends AsComponent> = Omit<BaseElementProps<C>, "onClick"> & {
  hit: ProductHit
}

/**
 * Wrapper component for rendering products in search result lists.
 *
 * Wrap product rendering with this component so product clicks are tracked.
 *
 * @group Components
 */
export function SerpElement<C extends AsComponent>({ children, hit, componentProps, as }: SerpElementProps<C>) {
  const config = useConfig()
  const { pageType } = config
  const track = pageType === "autocomplete" ? undefined : pageType === "search" ? "serp" : pageType
  const preservePageScroll = config.pageType !== "autocomplete" && config.preservePageScroll

  const onClick = useCallback(() => {
    if (hit && track) {
      nostojs(api => api.recordSearchClick(track, hit as SearchHit))
    }
    if (preservePageScroll) {
      savePageScroll()
    }
  }, [hit, track, preservePageScroll])

  return (
    <BaseElement as={as} onClick={onClick} componentProps={componentProps}>
      {children}
    </BaseElement>
  )
}
