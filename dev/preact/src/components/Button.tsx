import { ButtonHTMLAttributes } from "preact/compat"

import { buttonCSS, buttonStyles } from "../Component.styles"

export function Button({ children, style, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <>
      <button
        {...props}
        style={{
          ...buttonStyles.button,
          ...(typeof style === "object" ? style : {})
        }}
      >
        {/* Hover effect separate to preserve user's background color */}
        <div style={buttonStyles.overlay} className="button-overlay" />
        {children}
      </button>
      <style>{buttonCSS}</style>
    </>
  )
}
