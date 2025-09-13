import { CategoryPageProvider } from "../../../category/src/CategoryPageProvider"
import { ErrorBoundary } from "../../../common/src/components/ErrorBoundary"
import { Store } from "../../../common/src/store/store"

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
