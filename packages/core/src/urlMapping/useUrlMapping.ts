import { SearchQuery } from "@nosto/nosto-js/client"

import { Mappers, MappingResult, PageData } from "./types"

export function useUrlMapping(mappers: Mappers) {
  function decode(searchParams: URLSearchParams): MappingResult {
    const query: SearchQuery = {
      products: {}
    }
    const customParams = new URLSearchParams()

    for (const [key, value] of searchParams.entries()) {
      if (mappers.query.field(key)) {
        query.query = mappers.query.decode(value, key)
      } else if (mappers.sort.field(key)) {
        query.products!.sort = query.products?.sort ?? []
        query.products?.sort?.push(...mappers.sort.decode(value, key))
      } else if (mappers.filter.field(key)) {
        query.products!.filter = query.products?.filter ?? []
        query.products?.filter?.push(...mappers.filter.decode(value, key))
      } else if (mappers.pagination.field(key)) {
        Object.assign(query.products!, mappers.pagination.decode(value, key))
      } else {
        customParams.set(key, value)
      }
    }

    return { query, customParams }
  }

  function encode({ query, customParams }: MappingResult): URLSearchParams {
    const searchParams = new URLSearchParams()
    if (query.query) {
      mappers.query.encode(query.query, searchParams)
    }
    if (query.products?.sort) {
      mappers.sort.encode(query.products!.sort!, searchParams)
    }
    if (query.products?.filter) {
      mappers.filter.encode(query.products!.filter!, searchParams)
    }
    mappers.pagination.encode(query.products as PageData, searchParams)
    for (const [key, value] of customParams.entries()) {
      searchParams.set(key, value)
    }
    return searchParams
  }

  return {
    decode,
    encode
  }
}
