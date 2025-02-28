import { ComponentChildren, toChildArray, VNode } from "preact"

type Props<T extends object> = {
  children: ComponentChildren
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  select: (vnode: VNode<any>) => vnode is VNode<T>
  where: (vnode: VNode<T>) => boolean
  bind: () => Partial<T>
}

function isVNode(child: unknown): child is VNode {
  return !!child && typeof child === "object" && "type" in child && "props" in child
}
function extractVNodes(children: ComponentChildren): VNode[] {
  return toChildArray(children).filter(isVNode)
}

export function renderHeadless<T extends object>(props: Props<T>) {
  const { children } = props
  const vnodes = extractVNodes(children)
  vnodes.forEach(vnode => {
    if (props.select(vnode) && props.where(vnode)) {
      vnode.props = { ...vnode.props, ...props.bind() }
    }
    vnode.props.children = renderHeadless({ ...props, children: vnode.props.children })
  })
  return children
}
