import { ErrorBoundary } from "@preact/common/components/ErrorBoundary"
import { render } from "@testing-library/preact"
import * as loggerModule from "@utils/logger"
import { describe, expect, it, vi } from "vitest"
import { useEffect } from "preact/hooks"

describe("ErrorBoundary", () => {
  it("logs a warning when an error is caught", () => {
    const warnSpy = vi.spyOn(loggerModule.logger, "warn")
    const errorSpy = vi.spyOn(loggerModule.logger, "error")

    const ThrowingChild = () => {
      useEffect(() => {
        throw new Error("Test error")
      }, [])
      return <div>Child</div>
    }

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    )

    expect(warnSpy).toHaveBeenCalled()
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
