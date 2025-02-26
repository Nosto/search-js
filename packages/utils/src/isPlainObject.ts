const isObject = (v: unknown): v is object => String(v) === "[object Object]"

export function isPlainObject<T = Record<string, unknown>>(value: unknown): value is T {
  if (!isObject(value)) {
    return false
  }
  const constructor = value.constructor
  if (constructor === undefined) {
    return true
  }
  const prototype = constructor.prototype
  if (!isObject(prototype)) {
    return false
  }
  // eslint-ignore-next-line no-prototype-builtins
  if (!prototype.hasOwnProperty("isPrototypeOf")) {
    return false
  }
  return true
}
