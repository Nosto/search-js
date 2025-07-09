import { useSwatches } from "@nosto/search-js/preact/hooks"

type Props = {
  swatches: ReturnType<typeof useSwatches>["swatches"]
  toggleOption: ReturnType<typeof useSwatches>["toggleOption"]
}

export default function ProductSwatches({ swatches, toggleOption }: Props) {
  if (!swatches || swatches.length === 0) {
    return null
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        alignItems: "stretch",
        padding: "8px 0"
      }}
    >
      {swatches.map(({ field, options }) => (
        <div
          key={field}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            alignItems: "flex-start"
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "2px"
            }}
          >
            {field}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              width: "100%"
            }}
          >
            {options.map(({ value, unavailable, selected }) => (
              <button
                key={value}
                onClick={e => {
                  e.preventDefault()
                  toggleOption(field, value)
                }}
                disabled={unavailable}
                style={{
                  padding: "8px 12px",
                  fontSize: "12px",
                  fontWeight: 500,
                  background: selected ? "#059669" : "#ffffff",
                  color: selected ? "#ffffff" : "#374151",
                  border: selected ? "2px solid #059669" : "2px solid #e5e7eb",
                  borderRadius: "8px",
                  cursor: unavailable ? "not-allowed" : "pointer",
                  opacity: unavailable ? 0.3 : 1,
                  transition: "all 0.2s ease",
                  minWidth: "44px",
                  textAlign: "center",
                  boxShadow: selected ? "0 2px 8px rgba(5,150,105,0.15)" : "0 1px 3px rgba(0,0,0,0.05)",
                  position: "relative",
                  outline: "none"
                }}
                onMouseEnter={e => {
                  if (!unavailable && !selected) {
                    e.currentTarget.style.background = "#f8fafc"
                    e.currentTarget.style.borderColor = "#d1d5db"
                    e.currentTarget.style.transform = "translateY(-1px)"
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"
                  }
                }}
                onMouseLeave={e => {
                  if (!unavailable && !selected) {
                    e.currentTarget.style.background = "#ffffff"
                    e.currentTarget.style.borderColor = "#e5e7eb"
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"
                  }
                }}
                onFocus={e => {
                  if (!unavailable && !selected) {
                    e.currentTarget.style.background = "#f8fafc"
                    e.currentTarget.style.borderColor = "#d1d5db"
                  }
                }}
                onBlur={e => {
                  if (!unavailable && !selected) {
                    e.currentTarget.style.background = "#ffffff"
                    e.currentTarget.style.borderColor = "#e5e7eb"
                  }
                }}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
