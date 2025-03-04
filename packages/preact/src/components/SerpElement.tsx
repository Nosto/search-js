import { nostojs } from "@nosto/nosto-js"
import { useConfig } from "@preact/config/configContext"
import { renderHeadless } from "@preact/dom/renderHeadless"
import { savePageScroll } from "@utils/savePageScroll"
import { JSX } from "preact"

/**
 * @group Components
 */
export type SerpElementProps = {
  hit: {
    productId: string
    url?: string
  }
  onClick?: (event: Event) => void
} & JSX.HTMLAttributes &
  JSX.SVGAttributes

/**
 * Wrapper component that can be used to wrap any element in the search result list.
 *
 * @group Components
 */
export function SerpElement({ children, hit, onClick }: SerpElementProps) {
  const { pageType } = useConfig()
  const track = pageType === "autocomplete" ? undefined : pageType

  return renderHeadless({
    children,
    updateElement: (vnode, ctx) => {
      if (ctx.depth > 0) {
        return vnode
      }

      vnode.props = {
        ...vnode.props,
        onClick: (event: MouseEvent) => {
          if (hit && track) {
            nostojs(api => api.recordSearchClick(track, hit))
          }
          savePageScroll()
          if (typeof onClick === "function") {
            onClick(event)
          }
        }
      }
      return vnode
    }
  })
}
