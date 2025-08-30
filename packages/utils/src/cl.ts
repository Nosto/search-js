/**
 * Utility function to join class names by filtering out falsy values and joining with spaces.
 *
 * @param classes - Class names to join (can include strings, undefined, null, false, etc.)
 * @returns Joined class names as a string
 *
 * @example
 * ```ts
 * cl("base", "active") // "base active"
 * cl("base", undefined, "active") // "base active"
 * cl("base", false && "conditional") // "base"
 * cl("base", condition ? "active" : undefined) // "base" or "base active"
 * ```
 */
export default function cl(...classes: unknown[]): string {
  return classes.filter(Boolean).join(" ")
}
