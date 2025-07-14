import { SearchQuery } from "@nosto/nosto-js/client"
import { PageType } from "@preact/common/types"
import { unique } from "@utils/unique"

export function withDefaultQuery(pageType: PageType, query: SearchQuery) {
  return {
    ...query,
    products: {
      facets: pageType === "autocomplete" ? undefined : ["*"],
      fields: defaultProductFields,
      ...query.products
    },
    ...(query.keywords
      ? {
          keywords: {
            ...query.keywords,
            fields: unique([...defaultKeywordFields, ...(query.keywords.fields ?? [])]),
            highlight: query.keywords.highlight ?? {
              preTag: "<strong>",
              postTag: "</strong>"
            }
          }
        }
      : {})
  }
}

const defaultProductFields = [
  "productId",
  "url",
  "name",
  "imageUrl",
  "imageHash",
  "thumbUrl",
  "description",
  "brand",
  "variantId",
  "availability",
  "price",
  "priceText",
  "categoryIds",
  "categories",
  "customFields.key",
  "customFields.value",
  "priceCurrencyCode",
  "datePublished",
  "listPrice",
  "unitPricingBaseMeasure",
  "unitPricingUnit",
  "unitPricingMeasure",
  "googleCategory",
  "gtin",
  "ageGroup",
  "gender",
  "condition",
  "alternateImageUrls",
  "ratingValue",
  "reviewCount",
  "inventoryLevel",
  "skus.id",
  "skus.name",
  "skus.price",
  "skus.listPrice",
  "skus.priceText",
  "skus.url",
  "skus.imageUrl",
  "skus.inventoryLevel",
  "skus.customFields.key",
  "skus.customFields.value",
  "skus.availability",
  "pid",
  "onDiscount",
  "extra.key",
  "extra.value",
  "saleable",
  "available",
  "tags1",
  "tags2",
  "tags3"
]

const defaultKeywordFields = ["keyword", "_redirect"]
