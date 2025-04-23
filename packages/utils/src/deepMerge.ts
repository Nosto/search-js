import { isPlainObject } from "./isPlainObject"
import type { Simplify } from "./simplify"
import type { Equals, Expect } from "./types"

/**
 * Merges multiple objects into one object.
 */
export function deepMerge<T extends unknown[]>(...objects: T): Merge<T> {
  return objects.reduce((prev, current) => mergeRecursive(prev, current)) as unknown as Merge<T>
}

/**
 * Merges multiple objects into one object, but does not simplify the result.
 */
export function deepMergePlain<T extends unknown[]>(...objects: T): PlainMerge<T> {
  return objects.reduce((prev, current) => mergeRecursive(prev, current)) as unknown as PlainMerge<T>
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
  if (isPlainObject(target)) {
    return target
  }

  return overrides
}

type Merge<T, U = unknown> = T extends [infer First, ...infer Rest] ? Merge<Rest, U & First> : Simplify<U>
type PlainMerge<T, U = unknown> = T extends [infer First, ...infer Rest] ? PlainMerge<Rest, U & First> : U

export type MergeTests = [
  // simple object merging
  Expect<Equals<Merge<[{ a: string }, { b: number }]>, { a: string; b: number }>>,
  // merge incompatible field types
  Expect<Equals<Merge<[{ a: string }, { a: number }]>, { a: never }>>,
  // merge compatible field types
  Expect<Equals<Merge<[{ a: string | undefined }, { a: string }]>, { a: string }>>,
  // merge multiple types
  Expect<Equals<Merge<[{ a: string }, { b: number }, { c: boolean }]>, { a: string; b: number; c: boolean }>>
]
