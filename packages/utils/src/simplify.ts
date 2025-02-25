import { Equals, Expect } from "./types"

export type Simplify<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

export type simplifyTests = [
  Expect<Equals<Simplify<{ firstName: string } & { lastName: string }>, { firstName: string; lastName: string }>>
]
