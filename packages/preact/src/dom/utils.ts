import { VNode } from "preact"
import { JSX } from "preact/jsx-runtime"

// Due to some Preact type shenanigans, we need to use `any` here. Both `unknown` or `never` don't infer properly.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnknownVnode = VNode<any>

export function isHTMLInput(vnode: UnknownVnode): vnode is VNode<JSX.IntrinsicElements["input"]> {
  return vnode.type === "input"
}

export function isAnchorTag(vnode: UnknownVnode): vnode is VNode<JSX.IntrinsicElements["a"]> {
  return vnode.type === "a"
}

export function supportsOnClick(vnode: UnknownVnode): vnode is VNode<{ onClick?: (event: MouseEvent) => void }> {
  return typeof vnode.props.onClick === "function"
}

export function isVNode(child: unknown): child is VNode {
  return !!child && typeof child === "object" && "type" in child && "props" in child
}
