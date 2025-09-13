import { waitForElements } from "../../../../utils/src/wait"
import { logger } from "../../../../utils/src/logger"
import { render } from "preact"
import { JSX } from "preact/jsx-runtime"

import { CssSelector, resolveCssSelector } from "../resolveCssSelector"

type Props = {
  cssSelector: CssSelector
  timeout?: number
  renderComponent: () => JSX.Element
}

export async function injectComponent({ cssSelector, timeout, renderComponent }: Props) {
  const selector = resolveCssSelector(cssSelector).selector
  const targets = await waitForElements({
    selector,
    timeout: timeout ?? 100
  })

  if (targets.length === 0) {
    throw new Error(`No elements found for selector: ${selector}`)
  }
  if (targets.length > 1) {
    logger.warn(`Multiple (${targets.length}) elements found for selector: ${selector}`)
  }

  render(renderComponent(), targets[0])
}
