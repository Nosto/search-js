import { nostojs } from "@nosto/nosto-js"
import { useCallback } from "preact/hooks"

import { AsComponent, BaseElement, BaseElementProps } from "./BaseElement"

export type AutocompleteElementProps<C extends AsComponent> = Omit<BaseElementProps<C>, "clickHandler"> & {
  hit: {
    productId?: string
    url?: string
    keyword?: string
  }
}

export function AutocompleteElement<C extends AsComponent>({
  as,
  children,
  hit,
  componentProps
}: AutocompleteElementProps<C>) {
  const onAnchorClick = useCallback(() => {
    const { productId, url } = hit
    if (productId && url) {
      nostojs(api => api.recordSearchClick("autocomplete", { productId, url }))
    }
  }, [hit])

  return (
    <BaseElement as={as} clickHandler={onAnchorClick} componentProps={componentProps}>
      {children}
    </BaseElement>
  )
}
