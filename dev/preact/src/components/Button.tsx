import { ButtonHTMLAttributes } from "preact/compat"

import { buttonStyles, styles } from "./Button.styles"

export function Button({ children, style, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <>
      <button
        {...props}
        style={{
          ...styles.button,
          ...(typeof style === "object" ? style : {})
        }}
      >
        {/* Hover effect separate to preserve user's background color */}
        <div style={styles.overlay} className="button-overlay" />
        {children}
      </button>
      <style>{buttonStyles}</style>
    </>
  )
}
