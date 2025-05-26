import { nostojs } from "@nosto/nosto-js"
import { useCallback } from "preact/hooks"

import { AsComponent, BaseElement, BaseElementProps } from "./BaseElement"
import { KeywordHit, ProductHit } from "./types"

export type AutocompleteElementProps<C extends AsComponent> = Omit<BaseElementProps<C>, "onClick"> & {
  hit: ProductHit | KeywordHit
}

export function AutocompleteElement<C extends AsComponent>({
  children,
  hit,
  as,
  componentProps
}: AutocompleteElementProps<C>) {
  const onClick = useCallback(() => {
    if (hit && "productId" in hit) {
      nostojs(api => api.recordSearchClick("autocomplete", hit))
    }
  }, [hit])

  return (
    <BaseElement onClick={onClick} as={as} componentProps={componentProps}>
      {children}
    </BaseElement>
  )
}
