export const styles = {
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

export const historyElementStyles = `
  .history-element.highlighted, .history-element:hover {
    background-color: #0c080811;
  }
`
