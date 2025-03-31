import { hasMoreResults, intersectionObserverSupported } from "@preact/components/InfiniteScroll/utils"
import { afterEach, describe, expect, it, vi } from "vitest"

describe("hasMoreResults", () => {
  it("should return true if there are more results to fetch", () => {
    const query = { products: { from: 0, size: 10 } }
    const result = { products: { hits: new Array(20).fill({}), total: 20 } }
    expect(hasMoreResults(query, result)).toBe(true)
  })

  it("should return false if there are no more results to fetch", () => {
    const query = { products: { from: 10, size: 10 } }
    const result = { products: { hits: new Array(20).fill({}), total: 20 } }
    expect(hasMoreResults(query, result)).toBe(false)
  })

  it("should return false if total is 0", () => {
    const query = { products: { from: 0, size: 10 } }
    const result = { products: { hits: new Array(10).fill({}), total: 10 } }
    expect(hasMoreResults(query, result)).toBe(false)
  })
})

describe("hasMoreResults", () => {
  const originalIntersectionObserver = window.IntersectionObserver
  const originalIntersectionObserverEntry = window.IntersectionObserverEntry

  afterEach(() => {
    window.IntersectionObserver = originalIntersectionObserver
    window.IntersectionObserverEntry = originalIntersectionObserverEntry
  })

  it("should return false if IntersectionObserver is not supported", () => {
    Object.defineProperty(window, "IntersectionObserver", { value: undefined, writable: true })
    Object.defineProperty(window, "IntersectionObserverEntry", { value: undefined, writable: true })

    expect(intersectionObserverSupported()).toBe(false)
  })

  it("should return false if intersectionRatio is not in IntersectionObserverEntry.prototype", () => {
    const mockIntersectionObserver = vi.fn()
    const mockIntersectionObserverEntry = { prototype: {} }
    Object.defineProperty(window, "IntersectionObserver", { value: mockIntersectionObserver, writable: true })
    Object.defineProperty(window, "IntersectionObserverEntry", { value: mockIntersectionObserverEntry, writable: true })

    expect(intersectionObserverSupported()).toBe(false)
  })
})
