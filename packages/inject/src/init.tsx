import { SearchPageProvider } from "@preact/config/pages/serp/provider.tsx"
import { createStore, Store } from "@preact/store.tsx"
import { logger } from "@utils/logger.ts"
import { render } from "preact"

import ErrorBoundary from "./components/ErrorBoundary.tsx"
import { CategoryInjectConfig, InitConfig } from "./config.ts"
import { resolveCssSelector } from "./resolveCssSelector.ts"
import { waitForElements } from "./wait.ts"

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

export async function init(config: InitConfig) {
  if (config.category && (!config.category.isCategoryPage || config.category.isCategoryPage?.())) {
    await injectCategory(config.category, createStore())
  }
}
