type Unfreeze<T> = T extends object ? { -readonly [K in keyof T]: Unfreeze<T[K]> } : T

export function mergeArrays<T extends (unknown[] | readonly unknown[] | undefined | null)[]>(
  ...objects: T
): Unfreeze<T>[number] {
  if (objects.every(object => object === undefined || object === null)) {
    return undefined
  }
  return objects
    .filter(object => Array.isArray(object))
    .reduce((prev, current) => {
      return prev!.concat(current)
    }, [])
}
