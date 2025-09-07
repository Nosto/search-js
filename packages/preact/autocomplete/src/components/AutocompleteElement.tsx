import { nostojs } from "@nosto/nosto-js"
import { AsComponent, BaseElement } from "@preact/common/components/BaseElement"
import { cl } from "@utils/cl"
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
  className,
  onClick,
  ...rest
}: AutocompleteElementProps<C>) {
  const handleClick = useCallback(() => {
    if (hit && "productId" in hit) {
      nostojs(api => api.recordSearchClick("autocomplete", hit))
    }
  }, [hit])

  return (
    <BaseElement
      onClick={handleClick}
      as={as}
      componentProps={{ ...rest, onClick }}
      className={cl("ns-autocomplete-element", className)}
    >
      {children}
    </BaseElement>
  )
}
