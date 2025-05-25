import { ComponentChildren, ComponentProps, ComponentType, JSX } from "preact"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsComponent = keyof JSX.IntrinsicElements | ComponentType<any>

export type WrapperProps<C extends AsComponent> = {
  as?: C
  children?: ComponentChildren
  componentProps?: JSX.LibraryManagedAttributes<C, ComponentProps<C>>
}

export type ProductHit = {
  productId: string
  url?: string
}

export type KeywordHit = {
  keyword: string
}
