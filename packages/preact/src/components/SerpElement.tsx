import { nostojs } from "@nosto/nosto-js"
import { useConfig } from "@preact/config/configContext"
import { savePageScroll } from "@utils/savePageScroll"
import { ComponentChildren, ComponentProps, ComponentType, JSX } from "preact"
import { useCallback } from "preact/hooks"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsComponent = keyof JSX.IntrinsicElements | ComponentType<any>

/**
 * @group Components
 */
export type SerpElementProps<C extends AsComponent> = {
  hit: {
    productId: string
    url?: string
  }
  as?: C
  onClick?: (event: JSX.TargetedMouseEvent<HTMLElement>) => void
  componentProps?: JSX.LibraryManagedAttributes<C, ComponentProps<C>>
  children?: ComponentChildren
}

/**
 * Wrapper component that can be used to wrap any element in the search result list.
 *
 * @group Components
 */
export function SerpElement<C extends AsComponent>({
  as,
  children,
  hit,
  onClick,
  componentProps
}: SerpElementProps<C>) {
  const { pageType } = useConfig()
  const track = pageType === "autocomplete" ? undefined : pageType === "search" ? "serp" : pageType

  const onAnchorClick = useCallback(
    (event: JSX.TargetedMouseEvent<HTMLElement>) => {
      if (hit && track) {
        nostojs(api => api.recordSearchClick(track, hit))
      }
      savePageScroll()
      if (typeof onClick === "function") {
        onClick(event)
      }
      if (componentProps && "onClick" in componentProps && typeof componentProps.onClick === "function") {
        componentProps.onClick(event)
      }
    },
    [hit, onClick, componentProps, track]
  )

  const adjustedComponentProps = {
    ...componentProps!,
    onClick: onAnchorClick
  }

  const Comp = as ?? "a"

  return <Comp {...adjustedComponentProps}>{children}</Comp>
}
