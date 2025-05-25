import { nostojs } from "@nosto/nosto-js"
import { useCallback } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"

import { AsComponent, KeywordHit, ProductHit, WrapperProps } from "./types"

export type AutocompleteElementProps<C extends AsComponent> = WrapperProps<C> & {
  hit: ProductHit | KeywordHit
}

export function AutocompleteElement<C extends AsComponent>({
  hit,
  as,
  children,
  componentProps
}: AutocompleteElementProps<C>) {
  const props = {
    ...componentProps,
    onClick: useCallback(
      (event: JSX.TargetedMouseEvent<HTMLElement>) => {
        if (hit && "productId" in hit) {
          nostojs(api => api.recordSearchClick("autocomplete", hit))
        }
        componentProps?.onClick?.(event)
      },
      [componentProps, hit]
    )
  }

  const Comp = as ?? (componentProps && "href" in componentProps ? "a" : "span")

  return <Comp {...props}>{children}</Comp>
}
