import { logger } from "@utils/logger"
import { render } from "preact"
import { JSX } from "preact/jsx-runtime"

import { CssSelector, resolveCssSelector } from "../resolveCssSelector"
import { waitForElements } from "../wait"

export async function injectComponent(cssSelector: CssSelector, renderComponent: () => JSX.Element) {
  const selector = resolveCssSelector(cssSelector).selector
  const targets = await waitForElements({
    selector,
    timeout: 100
  })

  if (targets.length === 0) {
    throw new Error(`No elements found for selector: ${selector}`)
  }
  if (targets.length > 1) {
    logger.warn(`Multiple (${targets.length}) elements found for selector: ${selector}`)
  }

  render(renderComponent(), targets[0])
}
