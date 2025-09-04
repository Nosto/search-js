import { ComponentChildren } from "preact"

import { productListStyles } from "../../Component.styles"

type Props = {
  children: ComponentChildren
}

export function ProductList({ children }: Props) {
  return (
    <div style={productListStyles.container}>
      <div style={productListStyles.grid}>{children}</div>
    </div>
  )
}
