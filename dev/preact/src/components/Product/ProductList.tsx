import { ComponentChildren } from "preact"

import { styles } from "./ProductList.styles"

type Props = {
  children: ComponentChildren
}

export function ProductList({ children }: Props) {
  return (
    <div style={styles.container}>
      <div style={styles.grid}>{children}</div>
    </div>
  )
}
