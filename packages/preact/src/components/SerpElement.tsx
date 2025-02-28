import { nostojs } from "@nosto/nosto-js"
import { savePageScroll } from "@preact/dom/preservePageScroll"
import { useNostoAppState } from "@preact/hooks/useNostoAppState"
import { cloneElement, Fragment, h, JSX } from "preact"

/**
 * @group Components
 */
export type SerpElementProps = {
  hit: {
    productId: string
    url?: string
  }
  onClick?: (event: Event) => void
  as?: string
} & JSX.HTMLAttributes &
  JSX.SVGAttributes

/**
 * SerpElement is a wrapper component that can be used to wrap any element in the search result list.
 *
 * @group Components
 */
export function SerpElement({ children, hit, as, onClick, ...rest }: SerpElementProps): JSX.Element {
  const pageType = useNostoAppState(state => state.pageType)
  const track = pageType === "category" ? "category" : pageType === "search" ? "serp" : undefined

  const childArray = children instanceof Array ? children : [children]

  if (as) {
    return h(
      as,
      {
        ...(as === "a" && hit && typeof hit === "object" && "url" in hit && typeof hit.url === "string"
          ? {
              href: hit.url
            }
          : {}),
        ...rest,
        onClick: (event: MouseEvent) => {
          if (hit && track) {
            nostojs(api => api.recordSearchClick(track, hit))
          }
          savePageScroll()
          return onClick?.(event)
        }
      },
      ...childArray
    )
  }

  return (
    <Fragment>
      {childArray.map((child, index) => {
        if (child && typeof child === "object" && "props" in child) {
          const onClick: JSX.HTMLAttributes["onClick"] = event => {
            if (hit && track) {
              nostojs(api => api.recordSearchClick(track, hit))
            }
            savePageScroll()
            if (typeof child.props?.onClick == "function") {
              child.props.onClick(event)
            }
          }

          return cloneElement(child, {
            ...child.props,
            onClick,
            key: index
          })
        }
        return child
      })}
    </Fragment>
  )
}
