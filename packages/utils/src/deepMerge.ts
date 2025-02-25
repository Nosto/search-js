import { isPlainObject } from "./isPlainObject"
import type { Simplify } from "./simplify"
import type { Equals, Expect } from "./types"

export function deepMerge<T extends unknown[]>(...objects: T): Merge<T> {
  return objects.reduce((prev, current) => mergeRecursive(prev, current)) as unknown as Merge<T>
}

function mergeRecursive(target: unknown, overrides: unknown): unknown {
  if (isPlainObject(target) && isPlainObject(overrides)) {
    return Object.entries(overrides).reduce(
      (prev, [key, value]) => {
        prev[key] = mergeRecursive(prev[key], value)
        return prev
      },
      { ...target }
    )
  }

  return overrides
}

type Merge<T, U = unknown> = T extends [infer First, ...infer Rest] ? Merge<Rest, U & First> : Simplify<U>

export type MergeTests = [
  // simple object merging
  Expect<Equals<Merge<[{ a: string }, { b: number }]>, { a: string; b: number }>>,
  // merge incompatible field types
  Expect<Equals<Merge<[{ a: string }, { a: number }]>, { a: string & number }>>,
  // merge compatible field types
  Expect<Equals<Merge<[{ a: string | undefined }, { a: string }]>, { a: string }>>,
  // merge multiple types
  Expect<Equals<Merge<[{ a: string }, { b: number }, { c: boolean }]>, { a: string; b: number; c: boolean }>>
]
