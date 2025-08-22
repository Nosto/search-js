import { beforeEach, describe, expect, it, vi } from "vitest"
import { registerNostoElements } from "../src/registerElements"

// Mock custom elements API
const customElementsDefine = vi.fn()
const customElementsGet = vi.fn()

Object.defineProperty(global, "customElements", {
  value: {
    define: customElementsDefine,
    get: customElementsGet
  },
  writable: true
})

describe("registerNostoElements", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    customElementsGet.mockReturnValue(undefined) // Element not registered
  })

  it("registers all Nosto web components", () => {
    registerNostoElements()

    expect(customElementsDefine).toHaveBeenCalledTimes(5)
    expect(customElementsDefine).toHaveBeenCalledWith("nosto-autocomplete", expect.any(Function))
    expect(customElementsDefine).toHaveBeenCalledWith("nosto-filters", expect.any(Function))
    expect(customElementsDefine).toHaveBeenCalledWith("nosto-results", expect.any(Function))
    expect(customElementsDefine).toHaveBeenCalledWith("nosto-sorting", expect.any(Function))
    expect(customElementsDefine).toHaveBeenCalledWith("nosto-pagination", expect.any(Function))
  })

  it("does not register components that are already registered", () => {
    customElementsGet.mockReturnValue(class {}) // Element already registered

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
    
    registerNostoElements()

    expect(customElementsDefine).not.toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledTimes(5)
    expect(consoleSpy).toHaveBeenCalledWith("Custom element 'nosto-autocomplete' is already registered")

    consoleSpy.mockRestore()
  })

  it("handles missing custom elements API gracefully", () => {
    const originalCustomElements = global.customElements
    
    // @ts-expect-error - Testing runtime condition
    global.customElements = undefined

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
    
    registerNostoElements()

    expect(consoleSpy).toHaveBeenCalledWith("Custom Elements are not supported in this browser")
    
    consoleSpy.mockRestore()
    
    // Restore for other tests
    global.customElements = originalCustomElements
  })
})