import { cl } from "@utils/cl"
import { ComponentChildren, ComponentProps, ComponentType, JSX } from "preact"
import { useCallback } from "preact/hooks"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsComponent = keyof JSX.IntrinsicElements | ComponentType<any>

/**
 * @group Components
 */
export type BaseElementProps<C extends AsComponent> = JSX.LibraryManagedAttributes<C, ComponentProps<C>> & {
  trackingOnClick: () => void
  as?: C
  children?: ComponentChildren
  className?: string
}

/**
 * Wrapper component that can be used to wrap any element in the search result list.
 *
 * @group Components
 */
export function BaseElement<C extends AsComponent>({
  trackingOnClick,
  as,
  children,
  className,
  ...rest
}: BaseElementProps<C>) {
  const mergedOnClick = useCallback(
    (event: JSX.TargetedMouseEvent<HTMLElement>) => {
      trackingOnClick()
      // If there's an onClick in the rest props, call it as well
      if ("onClick" in rest && typeof rest.onClick === "function") {
        rest.onClick(event)
      }
    },
    [trackingOnClick, rest]
  )

  const componentClass = cl("className" in rest && rest.className, className)
  const Comp = as ?? (rest && "href" in rest ? "a" : "span")

  return (
    <Comp {...rest} onClick={mergedOnClick} className={componentClass}>
      {children}
    </Comp>
  )
}
