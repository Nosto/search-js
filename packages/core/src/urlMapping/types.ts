import { InputSearchFilter, InputSearchSort, SearchQuery } from "@nosto/nosto-js/client"

export type PageData = { from?: number; size: number }

export type UrlMappingConfig = {
  queryField: string
  filterFieldPrefix: string
  filterMapping?: Record<string, string>
  filterValueSeparator: string
  filterRangeSeparator: string
  sortField: string
  sortSeparator: string
  pageField: string
  pageSizeField: string
}

type Mapping<T> = {
  field: (f: string) => boolean
  encode(value: T, target: URLSearchParams): void
  decode(encoded: string, key: string): T
}

export type Mappers = {
  query: Mapping<string>
  sort: Mapping<InputSearchSort[]>
  filter: Mapping<InputSearchFilter[]>
  pagination: Mapping<PageData>
}

export interface MappingResult {
  query: SearchQuery
  customParams: URLSearchParams
}
