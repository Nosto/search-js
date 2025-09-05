export const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 16px",
    textDecoration: "none",
    color: "inherit",
    borderRadius: "6px",
    cursor: "pointer",
    minHeight: "56px"
  },
  image: {
    width: "44px",
    height: "44px",
    objectFit: "cover" as const,
    borderRadius: "5px",
    flexShrink: 0,
    background: "#f3f4f6",
    display: "block",
    margin: 0
  },
  content: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center"
  },
  brand: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#9ca3af",
    marginBottom: "2px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    lineHeight: 1
  },
  name: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#1f2937",
    lineHeight: 1.2,
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  priceContainer: {
    marginLeft: "auto",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-end",
    minWidth: "70px"
  },
  price: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#059669",
    lineHeight: 1
  },
  listPrice: {
    fontSize: "13px",
    color: "#9ca3af",
    textDecoration: "line-through",
    marginTop: "2px"
  }
}

export const productRowStyles = `
  .product-row {
    transition: background-color 0.15s ease;
  }
  .product-row:hover, .product-row.highlighted {
    background-color: #f3f4f6 !important;
  }
`
