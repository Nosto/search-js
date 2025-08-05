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
   * Action to perform on search submission (click or keyboard).
   */
  onSubmit: () => void
}

/**
 * @group Components
 */
export function HistoryElement({ children, class: className, onSubmit }: HistoryElementProps) {
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
