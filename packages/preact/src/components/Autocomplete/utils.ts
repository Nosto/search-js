import { ComponentChildren, JSX } from "preact"

/**
 * Check if the provided children is a valid HTML element (div/anchor/etc).
 */
export function isValidHTMLElement(children: ComponentChildren): children is JSX.Element {
  return children !== null && typeof children === "object" && "props" in children && typeof children.type === "string"
}
