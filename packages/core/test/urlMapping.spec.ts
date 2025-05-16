import { createMappers } from "@core/urlMapping/defaultMappers"
import { useUrlMapping } from "@core/urlMapping/useUrlMapping"
import { SearchQuery } from "@nosto/nosto-js/client"
import { describe, expect, it } from "vitest"

describe("useUrlMapping", () => {
  const baseQuery = {
    products: {
      from: 0,
      size: 20
    }
  }
  const config = {
    queryField: "q",
    sortField: "sort",
    sortSeparator: "~",
    filterMapping: {
      color: "custom.color"
    },
    filterFieldPrefix: "filter.",
    filterValueSeparator: ",",
    filterRangeSeparator: "~",
    pageField: "page",
    pageSizeField: "pageSize"
  }
  const mapping = useUrlMapping(createMappers(baseQuery, config))

  function testMapping(query: SearchQuery, expected: URLSearchParams, customParams = new URLSearchParams()) {
    expect(mapping.encode({ query, customParams }).toString()).toEqual(expected.toString())
    const result = mapping.decode(expected)
    expect(result.query).toEqual(query)
    expect(result.customParams.toString()).toEqual(customParams.toString())
  }

  it("decodes query parameters correctly", () => {
    testMapping({ query: "abc", products: {} }, new URLSearchParams([["q", "abc"]]))
  })

  it("decodes sort parameters correctly", () => {
    testMapping({ products: { sort: [{ field: "name", order: "asc" }] } }, new URLSearchParams([["sort", "name~asc"]]))

    // with escaping
    testMapping(
      { products: { sort: [{ field: "name~", order: "asc" }] } },
      new URLSearchParams([["sort", "name%7E~asc"]])
    )
  })

  it("decodes filter parameters correctly", () => {
    testMapping(
      { products: { filter: [{ field: "category", value: ["electronics"] }] } },
      new URLSearchParams([["filter.category", "electronics"]])
    )

    // with escaping
    testMapping(
      { products: { filter: [{ field: "range", value: ["100~200"] }] } },
      new URLSearchParams([["filter.range", "100%7E200"]])
    )

    // with escaping (2nd part)
    testMapping(
      { products: { filter: [{ field: "range", value: ["1~2~3"] }] } },
      new URLSearchParams([["filter.range", "1%7E2%7E3"]])
    )
  })

  it("decodes filter parameters using filterMapping correctly", () => {
    testMapping(
      { products: { filter: [{ field: "custom.color", value: ["blue"] }] } },
      new URLSearchParams([["color", "blue"]])
    )
  })

  it("decodes multiple filter parameters correctly", () => {
    testMapping(
      { products: { filter: [{ field: "category", value: ["shoes", "jackets"] }] } },
      new URLSearchParams([["filter.category", "shoes,jackets"]])
    )

    // with escaping
    testMapping(
      { products: { filter: [{ field: "category", value: ["shoes,", "jackets"] }] } },
      new URLSearchParams([["filter.category", "shoes%2C,jackets"]])
    )

    // with escaping (2nd part)
    testMapping(
      { products: { filter: [{ field: "category", value: ["sh,oe,s", "jackets"] }] } },
      new URLSearchParams([["filter.category", "sh%2Coe%2Cs,jackets"]])
    )
  })

  it("decodes filter ranges correctly", () => {
    testMapping(
      { products: { filter: [{ field: "price", range: [{ gte: "100", lte: "200" }] }] } },
      new URLSearchParams([["filter.price", "100~200"]])
    )

    // with escaping
    testMapping(
      { products: { filter: [{ field: "price", range: [{ gte: "100~", lte: "200" }] }] } },
      new URLSearchParams([["filter.price", "100%7E~200"]])
    )

    // with escaping (2nd part)
    testMapping(
      { products: { filter: [{ field: "price", range: [{ gte: "1~2~3", lte: "200" }] }] } },
      new URLSearchParams([["filter.price", "1%7E2%7E3~200"]])
    )
  })

  it("decodes multiple filter ranges correctly", () => {
    testMapping(
      {
        products: {
          filter: [
            {
              field: "price",
              range: [
                { gte: "50", lte: "60" },
                { gte: "100", lte: "200" }
              ]
            }
          ]
        }
      },
      new URLSearchParams([["filter.price", "50~60,100~200"]])
    )
  })

  it("decode page parameters correctly", () => {
    testMapping({ products: { from: 20, size: 20 } }, new URLSearchParams([["page", "2"]]))
  })

  it("decodes page size parameters correctly", () => {
    testMapping({ products: { size: 50 } }, new URLSearchParams([["pageSize", "50"]]))
  })

  it("handle custom parameters correctly", () => {
    testMapping(
      { products: { from: 20, size: 20 } },
      new URLSearchParams([
        ["page", "2"],
        ["customParam", "customValue"]
      ]),
      new URLSearchParams([["customParam", "customValue"]])
    )
  })
})
