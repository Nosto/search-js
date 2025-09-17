import { render } from "@testing-library/preact"
import { describe, expect, it, vi } from "vitest"

import ErrorBoundary from "../../src/components/ErrorBoundary"

vi.mock("@utils/logger", () => ({
  logger: {
    error: vi.fn()
  }
}))

describe("ErrorBoundary", () => {
  it("should render children when there's no error", () => {
    const { getByText } = render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )

    expect(getByText("Test content")).toBeDefined()
  })

  it("should be importable from the common package", () => {
    expect(ErrorBoundary).toBeDefined()
    expect(typeof ErrorBoundary).toBe("function")
  })
})