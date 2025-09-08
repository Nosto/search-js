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
  ...directProps
}: AutocompleteElementProps<C>) {
  const onClick = useCallback(() => {
    if (hit && "productId" in hit) {
      nostojs(api => api.recordSearchClick("autocomplete", hit))
    }
  }, [hit])

  // Filter out undefined values from direct props
  const componentProps = Object.fromEntries(Object.entries(directProps).filter(([, value]) => value !== undefined))

  return (
    <BaseElement onClick={onClick} as={as} className="ns-autocomplete-element" componentProps={componentProps}>
      {children}
    </BaseElement>
  )
}
