import { nostojs } from "@nosto/nosto-js"
import { useConfig } from "@preact/config/configContext"
import { savePageScroll } from "@utils/savePageScroll"
import { useCallback } from "preact/hooks"

import { AsComponent, BaseElement, BaseElementProps } from "./BaseElement"

/**
 * @group Components
 */
export type SerpElementProps<C extends AsComponent> = Omit<BaseElementProps<C>, "onClick"> & {
  hit: {
    productId: string
    url?: string
  }
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
      nostojs(api => api.recordSearchClick(track, hit))
    }
    savePageScroll()
  }, [hit, track])

  return (
    <BaseElement as={as} onClick={onClick} componentProps={componentProps}>
      {children}
    </BaseElement>
  )
}
