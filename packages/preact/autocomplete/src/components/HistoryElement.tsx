import { ComponentChildren } from "preact"

/**
 * @group Components
 */
export interface HistoryElementProps {
  children: ComponentChildren
  /**
   * Append class to element.
   */
  class?: string
  /**
   * Append class when element is selected with keyboard.
   */
  activeClass?: string
  /**
   * Execute new search on the selection.
   */
  onSubmit: () => void
}

/**
 * @group Components
 */
export function HistoryElement({ children, class: className, onSubmit }: HistoryElementProps) {
  // TODO: Use historyElement (currently not used)
  //   const onSubmit = useContext(Context)

  return (
    <div
      className={`ns-autocomplete-element ${className || ""}`}
      onClick={() => {
        onSubmit()
      }}
      onKeyDown={event => {
        if (event.key === "Enter") {
          onSubmit()
        }
      }}
    >
      {children}
    </div>
  )
}
