import { SearchCategory, SearchKeyword, SearchPopularSearch, SearchProduct } from "@nosto/nosto-js/client"

export type ProductHit = Pick<SearchProduct, "productId" | "url">

export type CategoryHit = Pick<SearchCategory, "externalId" | "fullName" | "url">

export type KeywordHit = Pick<SearchKeyword, "keyword">

export type PopularSearchHit = Pick<SearchPopularSearch, "query">
