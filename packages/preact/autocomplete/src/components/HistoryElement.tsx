import { SearchQuery } from "@nosto/nosto-js/client"
import { ComponentChildren, Fragment } from "preact"

/**
 * @group Components
 */
export interface HistoryElementProps {
  children: ComponentChildren
  /**
   * Execute new search with specified query on the selection.
   */
  query?: SearchQuery
  /**
   * Append class to element.
   */
  class?: string
  /**
   * Append class when element is selected with keyboard.
   */
  activeClass?: string
}

/**
 * @group Components
 */
export function HistoryElement({ children, query, class: className }: HistoryElementProps) {
  // TODO: Use historyElement (currently not used)
  //   const onSubmit = useContext(Context)

  return (
    <Fragment>
      <div
        className={`ns-autocomplete-element ${className || ""}`}
        data-nosto-query={query?.query}
        onClick={() => {
          if (query) {
            // onSubmit(query)
          }
        }}
        onKeyDown={event => {
          if (event.key === "Enter" && query) {
            // onSubmit(query)
          }
        }}
      >
        {children}
      </div>
    </Fragment>
  )
}
