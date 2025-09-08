import { cl } from "@utils/cl"
import { ComponentChildren, ComponentProps, ComponentType, JSX } from "preact"
import { useCallback } from "preact/hooks"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsComponent = keyof JSX.IntrinsicElements | ComponentType<any>

/**
 * @group Components
 */
export type BaseElementProps<C extends AsComponent> = {
  onClick: () => void
  as?: C
  componentProps?: JSX.LibraryManagedAttributes<C, ComponentProps<C>>
  children?: ComponentChildren
  className?: string
} & Partial<JSX.LibraryManagedAttributes<C, ComponentProps<C>>>

/**
 * Wrapper component that can be used to wrap any element in the search result list.
 *
 * @group Components
 */
export function BaseElement<C extends AsComponent>({
  onClick,
  as,
  children,
  componentProps,
  className,
  ...props
}: BaseElementProps<C>) {
  // Merge componentProps (for backward compatibility) with direct props (new pattern)
  const allProps = {
    ...componentProps,
    ...props,
    onClick: useCallback(
      (event: JSX.TargetedMouseEvent<HTMLElement>) => {
        onClick()
        // Call original onClick from componentProps (backward compatibility)
        componentProps?.onClick?.(event)
        // Call original onClick from direct props (new pattern)
        if ("onClick" in props && typeof props.onClick === "function") {
          props.onClick(event)
        }
      },
      [onClick, componentProps, props]
    )
  }

  const componentClass = cl("className" in allProps && allProps.className, className)
  const Comp = as ?? (componentProps && "href" in componentProps ? "a" : allProps && "href" in allProps ? "a" : "span")

  return (
    <Comp {...allProps} className={componentClass}>
      {children}
    </Comp>
  )
}
