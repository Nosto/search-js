import { InfiniteScroll } from "@nosto/search-js/preact/common"
import { useNostoAppState, useSizeOptions } from "@nosto/search-js/preact/hooks"

import { ProductCard } from "../../../components/Product/ProductCard"
import { ProductList } from "../../../components/Product/ProductList"
import { defaultConfig, pageSizes } from "../../../defaultConfig"

export function SearchContentInfinite() {
  const { hits } = useNostoAppState(state => ({ hits: state.response.products?.hits || [] }))
  const { size } = useSizeOptions(pageSizes, defaultConfig.searchPageSize)

  return (
    <ProductList>
      <InfiniteScroll pageSize={size}>
        {hits.map(hit => (
          <ProductCard key={hit.productId} product={hit} />
        ))}
      </InfiniteScroll>
    </ProductList>
  )
}
