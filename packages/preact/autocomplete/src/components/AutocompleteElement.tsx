import { nostojs } from "@nosto/nosto-js"
import { AsComponent, BaseElement } from "@preact/common/components/BaseElement"
import { ComponentProps, JSX } from "preact"
import { useCallback } from "preact/hooks"

import { KeywordHit, ProductHit } from "../types"

export type AutocompleteElementProps<C extends AsComponent> = JSX.LibraryManagedAttributes<C, ComponentProps<C>> & {
  as?: C
  hit: ProductHit | KeywordHit
  componentProps?: JSX.LibraryManagedAttributes<C, ComponentProps<C>>
}

export function AutocompleteElement<C extends AsComponent>({
  children,
  hit,
  as,
  componentProps,
  ...directProps
}: AutocompleteElementProps<C>) {
  const onClick = useCallback(() => {
    if (hit && "productId" in hit) {
      nostojs(api => api.recordSearchClick("autocomplete", hit))
    }
  }, [hit])

  // Merge componentProps with direct props, filtering out undefined values
  const mergedComponentProps = {
    ...componentProps,
    ...Object.fromEntries(Object.entries(directProps).filter(([, value]) => value !== undefined))
  }

  return (
    <BaseElement onClick={onClick} as={as} className="ns-autocomplete-element" componentProps={mergedComponentProps}>
      {children}
    </BaseElement>
  )
}
