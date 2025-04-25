import { isPlainObject } from "./isPlainObject"

export function omitUndefined<T extends object>(query: T): T {
  return Object.entries(query)
    .filter(([k, v]) => k !== "time" && v !== undefined)
    .reduce((acc, [key, value]) => {
      if (isPlainObject(value)) {
        return {
          ...acc,
          [key]: omitUndefined(value)
        }
      }

      if (Array.isArray(value)) {
        return {
          ...acc,
          [key]: value.map(v => (isPlainObject(v) ? omitUndefined(v) : v))
        }
      }

      return value !== undefined
        ? {
            ...acc,
            [key]: value
          }
        : acc
    }, {} as T)
}
