import { VNode } from "preact"
import { JSX } from "preact/jsx-runtime"

// Due to some Preact type shenanigans, we need to use `any` here. Both `unknown` or `never` don't infer properly.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnknownVnode = VNode<any>

export function isHTMLInput(vnode: UnknownVnode): vnode is VNode<JSX.IntrinsicElements["input"]> {
  return vnode.type === "input"
}
