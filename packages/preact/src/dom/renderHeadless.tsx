import { ComponentChildren, toChildArray, VNode } from "preact"

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
  updateElement: <P extends object>(vnode: VNode<P>) => VNode<P> | null
}

function isVNode(child: unknown): child is VNode {
  return !!child && typeof child === "object" && "type" in child && "props" in child
}

export function renderHeadless(props: Props): ComponentChildren {
  const { children } = props
  return toChildArray(children).map(child => {
    if (isVNode(child)) {
      const vnode = props.updateElement(child)
      if (vnode === null) {
        return null
      }
      vnode.props = {
        ...vnode.props,
        children: renderHeadless({ ...props, children: vnode.props.children })
      }
      return vnode
    }
    return child
  })
}
