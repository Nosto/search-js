import { CategoryPageProvider } from "@preact/category/CategoryPageProvider"
import { Store } from "@preact/common/store/store"

import ErrorBoundary from "../components/ErrorBoundary"
import { CategoryInjectConfig } from "../config"
import { injectComponent } from "./injectComponent"

export async function injectCategory(config: CategoryInjectConfig, store: Store) {
  const { render: userRender } = config

  const ComponentToRender = await userRender()

  const renderComponent = () => (
    <ErrorBoundary>
      <CategoryPageProvider store={store} config={config.config}>
        {ComponentToRender}
      </CategoryPageProvider>
    </ErrorBoundary>
  )

  injectComponent({
    ...config,
    renderComponent
  })
}
