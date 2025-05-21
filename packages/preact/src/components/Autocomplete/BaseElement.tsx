import { nostojs } from "@nosto/nosto-js"
import { useConfig } from "@preact/config/configContext"
import { ComponentChildren, ComponentProps, ComponentType } from "preact"
import { useCallback } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsComponent = keyof JSX.IntrinsicElements | ComponentType<any>

export type BaseElementProps<C extends AsComponent> = {
  hit: {
    productId?: string
    url?: string
    keyword?: string
  }
  as?: C
  componentProps?: JSX.LibraryManagedAttributes<C, ComponentProps<C>>
  children?: ComponentChildren
}

export function BaseElement<C extends AsComponent>({ as, children, hit, componentProps }: BaseElementProps<C>) {
  const { pageType } = useConfig()
  const track = pageType !== "autocomplete" ? undefined : pageType

  const onAnchorClick = useCallback(
    (event: JSX.TargetedMouseEvent<HTMLElement>) => {
      const { productId, url } = hit
      if (track && productId && url) {
        nostojs(api => api.recordSearchClick("autocomplete", { productId, url }))
      }
      if (componentProps && "onClick" in componentProps && typeof componentProps.onClick === "function") {
        componentProps.onClick(event)
      }
    },
    [hit, componentProps, track]
  )

  const adjustedComponentProps = {
    ...componentProps!,
    onClick: onAnchorClick
  }

  const Comp = as ?? "a"

  return <Comp {...adjustedComponentProps}>{children}</Comp>
}
