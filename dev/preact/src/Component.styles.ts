/**
 * Centralized styles for all components
 * Extracted from individual component files to eliminate inline styles
 */

// ProductSwatches styles
export const productSwatchesStyles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
    alignItems: "stretch",
    padding: "8px 0"
  },
  fieldContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    alignItems: "flex-start"
  },
  fieldLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    marginBottom: "2px"
  },
  optionsContainer: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "8px",
    width: "100%"
  },
  button: {
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: 500,
    borderRadius: "8px",
    cursor: "pointer",
    minWidth: "44px",
    textAlign: "center" as const,
    position: "relative" as const,
    outline: "none",
    transition: "all 0.2s ease"
  },
  buttonDefault: {
    background: "#ffffff",
    color: "#374151",
    border: "2px solid #e5e7eb",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
  },
  buttonSelected: {
    background: "#059669",
    color: "#ffffff",
    border: "2px solid #059669",
    boxShadow: "0 2px 8px rgba(5,150,105,0.15)"
  },
  buttonDisabled: {
    cursor: "not-allowed",
    opacity: 0.3
  }
}

// ProductCard styles
export const productCardStyles = {
  card: {
    display: "block",
    textDecoration: "none",
    color: "inherit",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    cursor: "pointer"
  },
  imageContainer: {
    position: "relative" as const,
    height: "300px",
    overflow: "hidden"
  },
  backgroundImage: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    filter: "blur(8px) brightness(0.8)",
    transform: "scale(1.1)",
    zIndex: 0
  },
  mainImage: {
    position: "relative" as const,
    width: "100%",
    height: "100%",
    objectFit: "contain" as const,
    display: "block",
    zIndex: 1
  },
  tagContainer: {
    position: "absolute" as const,
    top: "12px",
    left: "12px",
    zIndex: 1
  },
  tag: {
    display: "inline-block",
    padding: "4px 8px",
    fontSize: "11px",
    fontWeight: 600,
    color: "#059669",
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    borderRadius: "6px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px"
  },
  content: {
    padding: "16px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px"
  },
  brand: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    lineHeight: 1
  },
  name: {
    fontSize: "16px",
    fontWeight: 500,
    color: "#1f2937",
    lineHeight: 1.3,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden",
    minHeight: "42px"
  },
  priceContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "4px"
  },
  price: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#059669"
  },
  listPrice: {
    fontSize: "14px",
    color: "#9ca3af",
    textDecoration: "line-through"
  },
  swatchesContainer: {
    marginTop: "12px",
    paddingTop: "12px",
    borderTop: "1px solid #f3f4f6"
  },
  addToCartButton: {
    marginTop: "12px",
    width: "100%",
    padding: "10px 16px",
    background: "#059669",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer"
  }
}

// ProductRow styles
export const productRowStyles = {
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

// AutocompleteHistoryElement styles
export const autocompleteHistoryElementStyles = {
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

// AutocompleteHistory styles
export const autocompleteHistoryStyles = {
  container: {
    position: "absolute" as const,
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    zIndex: 1000,
    maxHeight: "400px",
    overflow: "auto",
    marginTop: "4px"
  },
  header: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#9ca3af",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    lineHeight: 1,
    padding: "8px 16px"
  }
}

// ProductList styles
export const productListStyles = {
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

// Button styles
export const buttonStyles = {
  button: {
    flexShrink: 0,
    padding: "12px 24px",
    fontSize: "16px",
    backgroundColor: "#673ab8",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    position: "relative" as const,
    overflow: "hidden",
    transition: "all 0.2s ease"
  },
  overlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    transition: "opacity 0.2s ease",
    pointerEvents: "none" as const
  }
}

// Header styles
export const headerStyles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: "2em"
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  toggleButton: {
    padding: "8px 16px"
  }
}

// Home styles
export const homeStyles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    width: "100%",
    height: "calc(100vh - 48px - 14px)",
    marginTop: "14px"
  },
  content: {
    padding: "16px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    flex: 1
  },
  textCenter: {
    textAlign: "center" as const
  },
  heading: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
    color: "#333"
  },
  paragraph: {
    fontSize: "1.2rem",
    color: "#666",
    maxWidth: "600px",
    margin: "0 auto"
  }
}

// AutocompleteContent styles
export const autocompleteContentStyles = {
  container: {
    position: "absolute" as const,
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    zIndex: 1000,
    maxHeight: "400px",
    overflow: "auto",
    marginTop: "4px"
  }
}

// CSS strings for components that use <style> tags
export const productSwatchesCSS = `
  .swatch-button {
    transition: all 0.2s ease;
  }
  .swatch-button:not(:disabled):not(.selected):hover {
    background: #f8fafc !important;
    border-color: #d1d5db !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
  }
  .swatch-button:not(:disabled):not(.selected):focus {
    background: #f8fafc !important;
    border-color: #d1d5db !important;
  }
`

export const productCardCSS = `
  .product-card {
    transition: all 0.2s ease;
  }
  .product-card:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
    border-color: #d1d5db !important;
  }
  .add-to-cart-button {
    transition: background-color 0.2s ease;
  }
  .add-to-cart-button:hover {
    background: #047857 !important;
  }
`

export const productRowCSS = `
  .product-row {
    transition: background-color 0.15s ease;
  }
  .product-row:hover, .product-row.highlighted {
    background-color: #f3f4f6 !important;
  }
`

export const autocompleteHistoryElementCSS = `
  .history-element.highlighted, .history-element:hover {
    background-color: #0c080811;
  }
`

export const buttonCSS = `
  button:hover .button-overlay {
    opacity: 1 !important;
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  button:active .button-overlay {
    opacity: 1 !important;
    background-color: rgba(0, 0, 0, 0.1);
  }
  
  button:active {
    transform: translateY(1px);
  }
`
