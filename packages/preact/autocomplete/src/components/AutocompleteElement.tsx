import { nostojs } from "@nosto/nosto-js"
import { AsComponent, BaseElement, BaseElementProps } from "@preact/common/components/BaseElement"
import { useAutocompleteConfig } from "@preact/common/config/configContext"
import { useCallback } from "preact/hooks"

import { KeywordHit, ProductHit } from "../types"

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

  const { elementClassName } = useAutocompleteConfig()

  return (
    <BaseElement onClick={onClick} as={as} componentProps={componentProps} className={elementClassName}>
      {children}
    </BaseElement>
  )
}
