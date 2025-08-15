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

export function AutocompleteHistoryElement({ item, highlighted }: { item: string; highlighted: boolean }) {
  const { handleSubmit } = useContext(AutocompleteContext)

  const onSubmit = () => {
    handleSubmit({ query: item })
  }

  return (
    <HistoryElement key={item} onSubmit={onSubmit}>
      <style>
        {`
          .history-element.highlighted, .history-element:hover {
            background-color: #0c080811;
          }
        `}
      </style>
      <div style={styles.container} className={"history-element" + (highlighted ? " highlighted" : "")}>
        <div style={styles.name}>{item}</div>
      </div>
    </HistoryElement>
  )
}
