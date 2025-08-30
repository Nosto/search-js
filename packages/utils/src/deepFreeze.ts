import { isPlainObject } from "./isPlainObject"
import { Equals, Expect } from "./types"

export function deepFreeze<T extends object>(obj: T): Readonly<Freeze<T>> {
  const frozenObj = Object.entries(obj).reduce((acc, [key, value]) => {
    const frozenValue = isPlainObject(value) ? deepFreeze(value) : Object.freeze(value)
    return {
      ...acc,
      [key]: frozenValue
    }
  }, {} as Freeze<T>)

  return Object.freeze(frozenObj)
}

type Freeze<T> = T extends object ? Readonly<{ [K in keyof T]: Freeze<T[K]> }> : T

export type DeepFreezeTests = [
  Expect<Equals<Freeze<{ a: string }>, { readonly a: string }>>,
  Expect<Equals<Freeze<{ a: { b: number } }>, { readonly a: { readonly b: number } }>>,
  Expect<Equals<Freeze<{ a: string[] }>, { readonly a: readonly string[] }>>
]
