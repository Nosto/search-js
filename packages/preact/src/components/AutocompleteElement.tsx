import { nostojs } from "@nosto/nosto-js"
import { useCallback } from "preact/hooks"

import { AsComponent, BaseElement, BaseElementProps } from "./BaseElement"

export type AutocompleteElementProps<C extends AsComponent> = Omit<BaseElementProps<C>, "onClick"> & {
  hit: {
    productId: string
    url?: string
    keyword?: string
  }
}

export function AutocompleteElement<C extends AsComponent>({
  children,
  hit,
  as,
  componentProps
}: AutocompleteElementProps<C>) {
  const onAnchorClick = useCallback(() => {
    if (hit) {
      nostojs(api => api.recordSearchClick("autocomplete", hit))
    }
  }, [hit])

  return (
    <BaseElement onClick={onAnchorClick} as={as} componentProps={componentProps}>
      {children}
    </BaseElement>
  )
}
