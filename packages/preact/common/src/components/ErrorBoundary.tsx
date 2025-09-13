import { logger } from "@utils/logger"
import { ComponentChildren, Fragment } from "preact"
import { useErrorBoundary } from "preact/hooks"

/**
 * Error boundary component to log UI level errors
 * @group Components
 */
export function ErrorBoundary({ children }: { children: ComponentChildren }) {
  const [error] = useErrorBoundary()

  if (error) {
    logger.error("Error caught in ErrorBoundary", error)
  }

  return <Fragment>{children}</Fragment>
}
