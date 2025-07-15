import { Store } from "@preact/common/store/store"
import { SearchPageProvider } from "@preact/serp/SerpPageProvider"
import { logger } from "@utils/logger.ts"
import { render } from "preact"

import ErrorBoundary from "../components/ErrorBoundary"
import { CategoryInjectConfig } from "../config"
import { resolveCssSelector } from "../resolveCssSelector"
import { waitForElements } from "../wait"

export async function injectCategory(config: CategoryInjectConfig, store: Store) {
  const { categorySelector, render: userRender } = config

  const selector = resolveCssSelector(categorySelector).selector
  const targets = await waitForElements({
    selector,
    timeout: 100
  })

  if (targets.length === 0) {
    throw new Error(`No category elements found for selector: ${selector}`)
  }
  if (targets.length > 1) {
    logger.warn(`Multiple (${targets.length}) category elements found for selector: ${selector}`)
  }

  const target = targets[0]
  const ComponentToRender = await userRender()

  render(
    <ErrorBoundary>
      <SearchPageProvider store={store} config={config}>
        {ComponentToRender}
      </SearchPageProvider>
    </ErrorBoundary>,
    target
  )
}
