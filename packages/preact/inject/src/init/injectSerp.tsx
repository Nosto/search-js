import { ErrorBoundary } from "../../../common/src/components/ErrorBoundary"
import { Store } from "../../../common/src/store/store"
import { SearchPageProvider } from "../../../serp/src/SerpPageProvider"

import { SerpInjectConfig } from "../config"
import { injectComponent } from "./injectComponent"

export async function injectSerp(config: SerpInjectConfig, store: Store) {
  const { render: userRender } = config

  const ComponentToRender = await userRender()

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
