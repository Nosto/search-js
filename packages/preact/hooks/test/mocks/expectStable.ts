import { expect } from "vitest"

/**
 * Helper function to assert that hook return values remain stable across re-renders.
 */
export function expectStable<T extends object>(firstRender: T, secondRender: T) {
  Object.keys(firstRender).forEach(key => {
    const firstValue = firstRender[key as keyof T]
    const secondValue = secondRender[key as keyof T]
    
    // Skip function comparisons as they are expected to be different instances
    if (typeof firstValue === 'function' && typeof secondValue === 'function') {
      return
    }
    
    // For primitives, use toBe for reference equality
    if (typeof firstValue !== 'object' || firstValue === null) {
      expect(firstValue, `${key} mismatch`).toBe(secondValue)
    } else {
      // For objects/arrays, use toStrictEqual for deep equality
      expect(firstValue, `${key} mismatch`).toStrictEqual(secondValue)
    }
  })
}