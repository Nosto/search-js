import { InfiniteScroll } from "@nosto/search-js/preact/common"
import { useNostoAppState } from "@nosto/search-js/preact/hooks"

import { ProductCard } from "../../../components/Product/ProductCard"
import { ProductList } from "../../../components/Product/ProductList"

export function SearchContentInfinite() {
  const { hits } = useNostoAppState(state => ({ hits: state.response.products?.hits || [] }))

  return (
    <ProductList>
      <InfiniteScroll pageSize={24}>
        {hits.map(hit => (
          <ProductCard key={hit.productId} product={hit} />
        ))}
      </InfiniteScroll>
    </ProductList>
  )
}
