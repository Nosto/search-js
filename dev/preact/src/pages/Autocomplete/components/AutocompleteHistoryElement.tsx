import { HistoryElement } from "@nosto/search-js/preact/autocomplete"
import { AutocompleteContext } from "@nosto/search-js/preact/inject"
import { useContext } from "preact/hooks"

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    color: "inherit",
    borderRadius: "6px",
    cursor: "pointer",
    minHeight: "1.5em",
    padding: "4px 8px"
  },
  name: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#1f2937",
    lineHeight: 1.2,
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
}

export function AutocompleteHistoryElement({ item }: { item: string }) {
  const { handleSubmit } = useContext(AutocompleteContext)

  const onSubmit = () => {
    handleSubmit({ query: item })
  }

  return (
    <HistoryElement key={item} onSubmit={onSubmit}>
      <div style={styles.container}>
        <div style={styles.name}>{item}</div>
      </div>
    </HistoryElement>
  )
}
