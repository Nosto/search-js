export const styles = {
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

export const swatchButtonStyles = `
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
