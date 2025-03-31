/**
 * Pick properties from an object
 * @param obj - The object to pick properties from
 * @param props - The properties to pick
 */
export function pick<T extends object, K extends keyof T>(obj: T, ...props: K[]): Pick<T, K> {
  return props.reduce(
    (result, prop) => {
      result[prop] = obj[prop]
      return result
    },

    {} as Pick<T, K>
  )
}
