export type CssSelector =
  | string
  | {
      selector: string
      position?: "first" | "last"
    }

export function resolveCssSelector(selector: CssSelector) {
  if (typeof selector === "string") {
    return {
      selector,
      position: "last"
    }
  }
  return {
    position: "last",
    ...selector
  }
}
