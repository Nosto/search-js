import { expect } from "vitest"


export function expectStable<T extends object>(firstRender: T, secondRender: T) {
  const mismatches = Object.keys(firstRender).filter(key => {
    const firstValue = firstRender[key as keyof T]
    const secondValue = secondRender[key as keyof T]
    return firstValue !== secondValue
  })
  if (mismatches.length > 0) {
    expect.fail(`Values changed on re-render for keys: ${mismatches.join(", ")}`)
  }
}
