import { ComponentChildren } from "preact"

type Props = {
  children: ComponentChildren
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    width: "100%",
    gap: 16,
    marginTop: 16,
    alignItems: "center"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "32px",
    width: "100%",
    maxWidth: "1200px",
    justifyContent: "center"
  }
}

export function ProductList({ children }: Props) {
  return (
    <div style={styles.container}>
      <div style={styles.grid}>{children}</div>
    </div>
  )
}
