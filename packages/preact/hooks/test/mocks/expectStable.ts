import { expect } from "vitest"

/**
 * Helper function to assert that hook return values remain stable across re-renders.
 * Handles both simple objects that can be compared with toStrictEqual and complex objects
 * that require selective property comparison (e.g., when functions are involved).
 */
export function expectStable(firstRender: any, secondRender: any, selectiveProps?: string[]) {
  if (selectiveProps) {
    // For hooks that return functions, compare only the specified properties
    const firstValues = selectiveProps.reduce((acc, prop) => {
      acc[prop] = firstRender[prop]
      return acc
    }, {} as any)
    
    const secondValues = selectiveProps.reduce((acc, prop) => {
      acc[prop] = secondRender[prop]
      return acc
    }, {} as any)
    
    expect(firstValues).toStrictEqual(secondValues)
  } else {
    // For simple objects, compare the entire result
    expect(firstRender).toStrictEqual(secondRender)
  }
}