import { nostojs } from "@nosto/nosto-js"
import { ProductHit } from "@preact/autocomplete/types"
import { AsComponent, BaseElement } from "@preact/common/components/BaseElement"
import { useConfig } from "@preact/common/config/configContext"
import { savePageScroll } from "@utils/savePageScroll"
import { ComponentProps, JSX } from "preact"
import { useCallback } from "preact/hooks"

/**
 * @group Components
 */
export type SerpElementProps<C extends AsComponent> = JSX.LibraryManagedAttributes<C, ComponentProps<C>> & {
  as?: C
  hit: ProductHit
}

/**
 * Wrapper component that can be used to wrap any element in the search result list.
 *
 * @group Components
 */
export function SerpElement<C extends AsComponent>({ children, hit, as, ...rest }: SerpElementProps<C>) {
  const { pageType } = useConfig()
  const track = pageType === "autocomplete" ? undefined : pageType === "search" ? "serp" : pageType

  const trackingOnClick = useCallback(() => {
    if (hit && track) {
      nostojs(api => api.recordSearchClick(track, hit))
    }
    savePageScroll()
  }, [hit, track])

  return (
    <BaseElement trackingOnClick={trackingOnClick} as={as} {...rest}>
      {children}
    </BaseElement>
  )
}
