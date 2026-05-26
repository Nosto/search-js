const base = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "36px",
  height: "36px",
  padding: "0 6px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: "500",
  textDecoration: "none",
  cursor: "pointer",
  color: "#444",
  lineHeight: 1,
  transition: "background 0.15s, border-color 0.15s, color 0.15s"
} as const

export const styles = {
  container: {
    display: "flex",
    gap: "4px",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px 0"
  },
  link: base,
  linkActive: {
    ...base,
    backgroundColor: "#673ab8",
    borderColor: "#673ab8",
    color: "#fff"
  },
  linkHover: {
    ...base,
    backgroundColor: "#f3f0f9",
    borderColor: "#c4b5e8"
  },
  ellipsis: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    fontSize: "14px",
    color: "#aaa",
    letterSpacing: "1px"
  }
}
