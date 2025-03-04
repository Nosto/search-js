import { HTMLInputSelector } from "@preact/dom/utils"
import { ComponentChildren } from "preact"

import { renderHeadless } from "../dom/renderHeadless"

type Props = {
  children: ComponentChildren
  onSearchInput: (target: HTMLInputElement) => void
}

export function SearchInput({ children, onSearchInput }: Props) {
  return renderHeadless({
    children,
    updateElement: vnode => {
      if (!HTMLInputSelector(vnode) || vnode.props.type !== "search") {
        return vnode
      }
      vnode.props = {
        ...vnode.props,
        onInput: event => {
          if (event.target instanceof HTMLInputElement) {
            onSearchInput(event.target)
          }
        }
      }
      return vnode
    }
  })
}
