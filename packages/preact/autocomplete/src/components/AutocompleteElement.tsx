import { nostojs } from "@nosto/nosto-js"
import { SearchHit } from "@nosto/nosto-js/client"
import { AsComponent, BaseElement, BaseElementProps } from "@preact/common/components/BaseElement"
import { useCallback } from "preact/hooks"

import { KeywordHit, PopularSearchHit, ProductHit } from "../types"

export type AutocompleteElementProps<C extends AsComponent> = Omit<BaseElementProps<C>, "onClick"> & {
  hit: ProductHit | KeywordHit | PopularSearchHit
}

export function AutocompleteElement<C extends AsComponent>({
  children,
  hit,
  as,
  componentProps
}: AutocompleteElementProps<C>) {
  const onClick = useCallback(() => {
    if (hit && "productId" in hit) {
      nostojs(api => api.recordSearchClick("autocomplete", hit as SearchHit))
    }
  }, [hit])

  return (
    <BaseElement onClick={onClick} as={as} componentProps={componentProps} className="ns-autocomplete-element">
      {children}
    </BaseElement>
  )
}
