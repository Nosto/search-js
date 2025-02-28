import { VNode } from "preact"
import { JSX } from "preact/jsx-runtime"

// Due to some Preact type shenanigans, we need to use `any` here. Both `unknown` or `never` don't infer properly.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnknownVnode = VNode<any>

export function HTMLInputSelector(vnode: VNode): vnode is VNode<JSX.IntrinsicElements["input"]> {
  return vnode.type === "input"
}

export function applyPropMutations<T extends object>(originalProps: T, overrides: Partial<T>): T {
  const props = { ...originalProps }
  for (const key in overrides) {
    if (overrides[key] === undefined) {
      props[key] = originalProps[key]
      continue
    }

    const originalProp = props[key]
    const mutatedProp = overrides[key]
    if (typeof mutatedProp === "function") {
      props[key] = ((...args: unknown[]) => {
        if (originalProp && typeof originalProp === "function") {
          originalProp(...args)
        }
        mutatedProp(...args)
      }) as T[Extract<keyof T, string>]
    } else {
      props[key] = overrides[key]
    }
  }
  return props
}
