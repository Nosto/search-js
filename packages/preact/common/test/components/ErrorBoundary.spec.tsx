import { ErrorBoundary } from "@preact/common/components/ErrorBoundary"
import { render, waitFor } from "@testing-library/preact"
import * as loggerModule from "@utils/logger"
import { describe, expect, it, vi } from "vitest"

describe("ErrorBoundary", () => {
  it("logs a warning when an error is caught", async () => {
    const warnSpy = vi.spyOn(loggerModule.logger, "warn").mockImplementation(() => {})
    const errorSpy = vi.spyOn(loggerModule.logger, "error").mockImplementation(() => {})
    vi.spyOn(console, "error").mockImplementation(() => {})

    const ThrowingChild = () => {
      throw new Error("Test error")
    }

    try {
      render(
        <ErrorBoundary>
          <ThrowingChild />
        </ErrorBoundary>
      )
    } catch {
      // error propagates out of the boundary in jsdom test environment
    }

    await waitFor(() => expect(warnSpy).toHaveBeenCalled())
    expect(errorSpy).not.toHaveBeenCalled()
  })

  it("renders children when no error occurs", () => {
    const result = render(
      <ErrorBoundary>
        <div>Safe Child</div>
      </ErrorBoundary>
    )

    expect(result.getByText("Safe Child")).toBeDefined()
  })
})
