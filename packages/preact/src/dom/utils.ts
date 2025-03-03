import { VNode } from "preact"
import { JSX } from "preact/jsx-runtime"

export function HTMLInputSelector(vnode: VNode): vnode is VNode<JSX.IntrinsicElements["input"]> {
  return vnode.type === "input"
}
