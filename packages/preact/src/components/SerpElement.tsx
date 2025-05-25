import { nostojs } from "@nosto/nosto-js"
import { useConfig } from "@preact/config/configContext"
import { savePageScroll } from "@utils/savePageScroll"
import { useCallback } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"

import { AsComponent, ProductHit, WrapperProps } from "./types"

/**
 * @group Components
 */
export type SerpElementProps<C extends AsComponent> = WrapperProps<C> & {
  hit: ProductHit
}

/**
 * Wrapper component that can be used to wrap any element in the search result list.
 *
 * @group Components
 */
export function SerpElement<C extends AsComponent>({ hit, as, children, componentProps }: SerpElementProps<C>) {
  const { pageType } = useConfig()
  const track = pageType === "autocomplete" ? undefined : pageType === "search" ? "serp" : pageType

  const props = {
    ...componentProps,
    onClick: useCallback(
      (event: JSX.TargetedMouseEvent<HTMLElement>) => {
        if (hit && track) {
          nostojs(api => api.recordSearchClick(track, hit))
        }
        componentProps?.onClick?.(event)
        savePageScroll()
      },
      [componentProps, hit, track]
    )
  }

  const Comp = as ?? (componentProps && "href" in componentProps ? "a" : "span")

  return <Comp {...props}>{children}</Comp>
}
