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
    select: HTMLInputSelector,
    where: vnode => vnode.props.type === "search",
    mutateProps: () => ({
      onInput: event => {
        if (event.target instanceof HTMLInputElement) {
          onSearchInput(event.target)
        }
      }
    })
  })
}
