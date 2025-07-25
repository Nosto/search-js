import { useConfig } from "@preact/common/config/configContext"
import { useEventBusSubscribe } from "@preact/events/eventBusSubscribe"
import { useActions } from "@preact/hooks/useActions"

export function StoreActionsListener() {
  const { pageType } = useConfig()
  const actions = useActions()

  useEventBusSubscribe({
    event: "actions/newSearch",
    callback: params => {
      if (pageType !== params.targetStore) {
        return
      }
      actions.newSearch(params.query, params.options)
    }
  })

  useEventBusSubscribe({
    event: "actions/updateSearch",
    callback: params => {
      if (pageType !== params.targetStore) {
        return
      }
      actions.updateSearch(params.query, params.options)
    }
  })

  useEventBusSubscribe({
    event: "actions/replaceFilter",
    callback: params => {
      if (pageType !== params.targetStore) {
        return
      }
      actions.replaceFilter(params.field, params.value)
    }
  })

  useEventBusSubscribe({
    event: "actions/toggleProductFilter",
    callback: params => {
      if (pageType !== params.targetStore) {
        return
      }
      actions.toggleProductFilter(params.field, params.value, params.active)
    }
  })

  return null
}
