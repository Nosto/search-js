import { nostojs } from "@nosto/nosto-js"
import { AsComponent, BaseElement } from "@preact/common/components/BaseElement"
import { ComponentChildren, ComponentProps, JSX } from "preact"
import { useCallback } from "preact/hooks"

import { KeywordHit, ProductHit } from "../types"

export type AutocompleteElementProps<C extends AsComponent> = JSX.LibraryManagedAttributes<C, ComponentProps<C>> & {
  as?: C
  hit: ProductHit | KeywordHit
  children?: ComponentChildren
}

export function AutocompleteElement<C extends AsComponent>({
  children,
  hit,
  as,
  ...rest
}: AutocompleteElementProps<C>) {
  const onClick = useCallback(() => {
    if (hit && "productId" in hit) {
      nostojs(api => api.recordSearchClick("autocomplete", hit))
    }
  }, [hit])

  const componentProps = rest as JSX.LibraryManagedAttributes<C, ComponentProps<C>>

  return (
    <BaseElement onClick={onClick} as={as} componentProps={componentProps} className="ns-autocomplete-element">
      {children}
    </BaseElement>
  )
}
