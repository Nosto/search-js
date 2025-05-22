import { ComponentChildren, ComponentProps, ComponentType, JSX } from "preact"
import { useCallback } from "preact/hooks"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsComponent = keyof JSX.IntrinsicElements | ComponentType<any>

/**
 * @group Components
 */
export type BaseElementProps<C extends AsComponent> = {
  clickHandler: () => void
  as?: C
  componentProps?: JSX.LibraryManagedAttributes<C, ComponentProps<C>>
  children?: ComponentChildren
}

/**
 * Wrapper component that can be used to wrap any element in the search result list.
 *
 * @group Components
 */
export function BaseElement<C extends AsComponent>({
  clickHandler,
  as,
  children,
  componentProps
}: BaseElementProps<C>) {
  const onAnchorClick = useCallback(
    (event: JSX.TargetedMouseEvent<HTMLElement>) => {
      clickHandler()
      if (componentProps && "onClick" in componentProps && typeof componentProps.onClick === "function") {
        componentProps.onClick(event)
      }
    },
    [clickHandler, componentProps]
  )

  const adjustedComponentProps = {
    ...componentProps!,
    onClick: onAnchorClick
  }

  const Comp = as ?? "a"

  return <Comp {...adjustedComponentProps}>{children}</Comp>
}
