import { InputSearchRangeFilter, SearchOptions, SearchQuery } from "@nosto/nosto-js/client"
import { PageType } from "@preact/common/types"

export type EventParams = {
  ["actions/newSearch"]: {
    query: SearchQuery
    options?: SearchOptions
    targetStore: PageType
  }
  ["actions/updateSearch"]: {
    query: SearchQuery
    options?: SearchOptions
    targetStore: PageType
  }
  ["actions/toggleProductFilter"]: {
    field: string
    value: string
    active: boolean
    targetStore: PageType
  }
  ["actions/replaceFilter"]: {
    field: string
    value: InputSearchRangeFilter | string | undefined
    targetStore: PageType
  }
  ["actions/removeAllFilters"]: {
    targetStore: PageType
  }
}

export type AllowedEvents = keyof EventParams
