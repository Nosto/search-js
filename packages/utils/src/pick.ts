export function pick<T extends object, K extends keyof T>(obj: T, ...props: K[]): Pick<T, K> {
  return props.reduce(
    (result, prop) => {
      result[prop] = obj[prop]
      return result
    },

    {} as Pick<T, K>
  )
}
