import { transform } from "@preact/hooks/useLoadMore/transform"
import { describe, expect, it } from "vitest"

describe("transform", () => {
  const query = {
    pageSearchQueryProps: { from: 0, size: 10, pageSize: 10 },
    searchQuery: { products: { from: 0, size: 10 } }
  }

  const previousResult = {
    products: {
      hits: [
        {
          productId: "12345",
          name: "Product 1"
        }
      ],
      total: 0,
      size: 10
    }
  }

  const newResult = {
    products: {
      hits: [
        {
          productId: "75835",
          name: "Product 2"
        },
        { productId: "6890", name: "Product 2" }
      ],
      total: 0,
      size: 10
    }
  }

  const result = { previousResult, newResult }

  it("should return transformed query when query is provided", () => {
    const { transformedQuery, transformedResult } = transform({ query })

    expect(transformedQuery).toEqual({
      from: 10,
      size: 10
    })
    expect(transformedResult).toBeUndefined()
  })

  it("should return transformed result when result is provided", () => {
    const { transformedQuery, transformedResult } = transform({ result })

    expect(transformedResult).toEqual({
      hits: [
        {
          productId: "12345",
          name: "Product 1"
        },
        {
          productId: "6890",
          name: "Product 2"
        }
      ],
      total: 0,
      size: 10
    })
    expect(transformedQuery).toBeUndefined()
  })

  it("should return both transformed query and result when both are provided", () => {
    const { transformedQuery, transformedResult } = transform({ query, result })

    expect(transformedQuery).toEqual({ products: { from: 10, size: 10 } })
    expect(transformedResult).toEqual({
      hits: [
        {
          productId: "12345",
          name: "Product 1"
        },
        {
          productId: "6890",
          name: "Product 2"
        }
      ],
      total: 0,
      size: 10
    })
  })

  it("should return an empty object when neither query nor result is provided", () => {
    const { transformedQuery, transformedResult } = transform({})

    expect(transformedQuery).toBeUndefined()
    expect(transformedResult).toBeUndefined()
  })
})
