import { InfiniteScroll } from "@nosto/search-js/preact/common"
import { useNostoAppState } from "@nosto/search-js/preact/hooks"

import { Product } from "./Product"

export function SearchContentInfinite() {
  const { hits } = useNostoAppState(state => ({ hits: state.response.products?.hits || [] }))

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 16, marginTop: 16 }}>
      <InfiniteScroll pageSize={5}>
        {hits.map(hit => (
          <Product key={hit.productId} product={hit} />
        ))}
      </InfiniteScroll>
    </div>
  )
}
