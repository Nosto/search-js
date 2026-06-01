import { useNostoAppState } from "@nosto/search-js/preact/hooks"

import { Pagination } from "../../../components/Pagination"
import { ProductCard } from "../../../components/Product/ProductCard"
import { ProductList } from "../../../components/Product/ProductList"
import { PageSizeSelect } from "../../../components/SizeSelect"

export function SearchContentPaginated() {
  const { hits } = useNostoAppState(state => ({ hits: state.response.products?.hits || [] }))

  return (
    <>
      <PageSizeSelect />
      <ProductList>
        {hits.map(hit => (
          <ProductCard key={hit.productId} product={hit} />
        ))}
      </ProductList>
      <Pagination />
    </>
  )
}
