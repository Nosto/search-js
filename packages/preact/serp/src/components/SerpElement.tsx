import { nostojs } from "@nosto/nosto-js"
import { ProductHit } from "@preact/autocomplete/types"
import { AsComponent, BaseElement } from "@preact/common/components/BaseElement"
import { useConfig } from "@preact/common/config/configContext"
import { savePageScroll } from "@utils/savePageScroll"
import { ComponentProps, JSX } from "preact"
import { useCallback } from "preact/hooks"

/**
 * @group Components
 */
export type SerpElementProps<C extends AsComponent> = JSX.LibraryManagedAttributes<C, ComponentProps<C>> & {
  as?: C
  hit: ProductHit
  componentProps?: JSX.LibraryManagedAttributes<C, ComponentProps<C>>
}

/**
 * Wrapper component that can be used to wrap any element in the search result list.
 *
 * @group Components
 */
export function SerpElement<C extends AsComponent>({
  children,
  hit,
  as,
  componentProps,
  ...directProps
}: SerpElementProps<C>) {
  const { pageType } = useConfig()
  const track = pageType === "autocomplete" ? undefined : pageType === "search" ? "serp" : pageType

  const onClick = useCallback(() => {
    if (hit && track) {
      nostojs(api => api.recordSearchClick(track, hit))
    }
    savePageScroll()
  }, [hit, track])

  // Merge componentProps with direct props, filtering out undefined values
  const mergedComponentProps = {
    ...componentProps,
    ...Object.fromEntries(Object.entries(directProps).filter(([, value]) => value !== undefined))
  }

  return (
    <BaseElement as={as} onClick={onClick} componentProps={mergedComponentProps}>
      {children}
    </BaseElement>
  )
}
