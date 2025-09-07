import { nostojs } from "@nosto/nosto-js"
import { AsComponent, BaseElement } from "@preact/common/components/BaseElement"
import { ComponentProps, JSX } from "preact"
import { useCallback } from "preact/hooks"

import { KeywordHit, ProductHit } from "../types"

export type AutocompleteElementProps<C extends AsComponent> = JSX.LibraryManagedAttributes<C, ComponentProps<C>> & {
  as?: C
  hit: ProductHit | KeywordHit
}

export function AutocompleteElement<C extends AsComponent>({
  children,
  hit,
  as,
  ...rest
}: AutocompleteElementProps<C>) {
  const trackingOnClick = useCallback(() => {
    if (hit && "productId" in hit) {
      nostojs(api => api.recordSearchClick("autocomplete", hit))
    }
  }, [hit])

  return (
    <BaseElement trackingOnClick={trackingOnClick} as={as} className="ns-autocomplete-element" {...rest}>
      {children}
    </BaseElement>
  )
}
