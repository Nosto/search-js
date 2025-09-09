export const styles = {
  container: {
    position: "relative" as const
  },
  form: {
    position: "relative" as const,
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    maxWidth: "500px",
    margin: "0 auto"
  },
  input: {
    flex: "1",
    width: "100%",
    padding: "12px 16px",
    fontSize: "16px",
    border: "2px solid #ddd",
    borderRadius: "8px",
    outline: "none"
  },
  dropdownContainer: {
    position: "relative" as const,
    maxWidth: "500px",
    margin: "0 auto"
  }
}
