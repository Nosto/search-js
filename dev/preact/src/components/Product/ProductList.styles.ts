export const styles = {
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
