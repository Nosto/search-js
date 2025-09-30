import { useConfig } from "@preact/common/config/configContext"
import { useEventBusSubscribe } from "@preact/events/eventBusSubscribe"
import { useActions } from "@preact/hooks/useActions"

export function StoreActionsListener() {
  const { pageType } = useConfig()
  const { newSearch, updateSearch, replaceFilter, toggleProductFilter } = useActions()

  useEventBusSubscribe({
    event: "actions/newSearch",
    callback: ({ query, options, targetStore }) => {
      if (pageType !== targetStore) {
        return
      }
      newSearch(query, options)
    }
  })

  useEventBusSubscribe({
    event: "actions/updateSearch",
    callback: ({ query, options, targetStore }) => {
      if (pageType !== targetStore) {
        return
      }
      updateSearch(query, options)
    }
  })

  useEventBusSubscribe({
    event: "actions/replaceFilter",
    callback: ({ field, value, targetStore }) => {
      if (pageType !== targetStore) {
        return
      }
      replaceFilter(field, value)
    }
  })

  useEventBusSubscribe({
    event: "actions/toggleProductFilter",
    callback: ({ field, value, active, targetStore }) => {
      if (pageType !== targetStore) {
        return
      }
      toggleProductFilter(field, value, active)
    }
  })

  useEventBusSubscribe({
    event: "events/removeAllFilters",
    callback: () => {
      updateSearch({
        products: {
          filter: []
        }
      })
    }
  })

  return null
}
