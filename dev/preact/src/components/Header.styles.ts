export const styles = {
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
  buttonBase: {
    padding: "8px 16px"
  }
}

export const getButtonStyle = (isEnabled: boolean, color: "green" | "blue") => {
  const colors = {
    green: {
      enabled: "#22c55e",
      shadow: "rgba(34, 197, 94, 0.15)"
    },
    blue: {
      enabled: "#22c55e", // Note: keeping this as green based on original code
      shadow: "rgba(99, 102, 241, 0.15)"
    }
  }

  return {
    ...styles.buttonBase,
    border: isEnabled ? `1px solid ${colors[color].enabled}` : "1px solid #6b7280",
    outline: isEnabled ? `1px solid ${colors[color].enabled}` : "1px solid #00000000",
    boxShadow: isEnabled ? `0 2px 8px ${colors[color].shadow}` : "0 2px 8px rgba(107, 114, 128, 0.15)"
  }
}
