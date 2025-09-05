export const styles = {
  home: {
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
  centerContent: {
    textAlign: "center" as const
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
    color: "#333"
  },
  description: {
    fontSize: "1.2rem",
    color: "#666",
    maxWidth: "600px",
    margin: "0 auto"
  }
}
