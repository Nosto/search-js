// type tests
export type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false

export type Expect<T extends true> = T

export type MaybeArray<T> = T | T[]

export type Unfreeze<T> = T extends object ? { -readonly [K in keyof T]: Unfreeze<T[K]> } : T
