import { ErrorBoundary } from "@preact/common/components/ErrorBoundary"
import { Store } from "@preact/common/store/store"
import { SearchPageProvider } from "@preact/serp/SerpPageProvider"

import { SerpInjectConfig } from "../config"
import { injectComponent } from "./injectComponent"

export async function injectSerp(config: SerpInjectConfig, store: Store) {
  const { render: userRender } = config

  const ComponentToRender = await userRender()

  // eslint-disable-next-line func-style
  const renderComponent = () => (
    <ErrorBoundary>
      <SearchPageProvider store={store} config={config.config}>
        {ComponentToRender}
      </SearchPageProvider>
    </ErrorBoundary>
  )

  injectComponent({
    ...config,
    renderComponent
  })
}
