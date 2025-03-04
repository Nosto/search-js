import { ComponentChildren, toChildArray, VNode } from "preact"

import { isVNode } from "./utils"

type Props = {
  children: ComponentChildren
  /**
   * Update the element with custom logic. Each vnode (valid JSX element) will be passed to this function recursively.
   * You may either mutate the existing node, or create a new one.
   *
   * @param vnode Current target node
   * @returns {VNode} if the vnode should be updated
   * @returns {null} if the vnode should be removed
   */
  updateElement: <P extends object>(vnode: VNode<P>, context: Context) => VNode<P> | null
}

type Context = {
  depth: number
}

export function renderHeadless(props: Props, ctx: Context = { depth: 0 }): ComponentChildren {
  const { children } = props
  return toChildArray(children).map(child => {
    if (!isVNode(child)) {
      return child
    }
    const vnode = props.updateElement(child, ctx)
    if (vnode === null) {
      return null
    }
    vnode.props = {
      ...vnode.props,
      children: renderHeadless({ ...props, children: vnode.props.children }, { depth: ctx.depth + 1 })
    }
    return vnode
  })
}
