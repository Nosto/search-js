import { useNostoAppState } from "@nosto/search-js/preact/hooks"

import { Pagination } from "../../components/Pagination"
import { Product } from "../Search/Product"

export function CategoryContentPaginated() {
  const { hits } = useNostoAppState(state => ({ hits: state.response.products?.hits || [] }))

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 16, marginTop: 16 }}>
      <div>
        {hits.map(hit => (
          <Product key={hit.productId} product={hit} />
        ))}
      </div>
      <Pagination />
    </div>
  )
}
