export const styles = {
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

export const buttonStyles = `
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
