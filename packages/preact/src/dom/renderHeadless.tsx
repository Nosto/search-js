import { ComponentChildren, toChildArray, VNode } from "preact"

import { applyPropMutations, UnknownVnode } from "./utils"

type Props<T extends object> = {
  children: ComponentChildren
  select?: (vnode: UnknownVnode) => vnode is VNode<T>
  where?: (vnode: VNode<T>) => boolean
  mutateProps: (vnode: VNode<T>) => Partial<T> | undefined
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
  const vnodeSelector = props.select ?? ((vnode: UnknownVnode): vnode is VNode<T> => true)
  const vnodeFilter = props.where ?? (() => true)
  vnodes.forEach(vnode => {
    const mutatedProps = (() => {
      if (vnodeSelector(vnode) && vnodeFilter(vnode)) {
        const propMutations = props.mutateProps(vnode)
        if (propMutations) {
          return applyPropMutations(vnode.props, propMutations)
        }
      }
      return vnode.props
    })()
    vnode.props = {
      ...mutatedProps,
      children: renderHeadless({ ...props, children: vnode.props.children })
    }
  })
  return children
}
