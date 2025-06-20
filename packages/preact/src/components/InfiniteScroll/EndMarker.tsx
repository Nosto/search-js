import { RefObject } from "preact";

export function EndMarker({ resultEndRef }: { resultEndRef: RefObject<HTMLDivElement> }) {
  return (
    <div style={{ position: "relative", height: "1px" }}>
      <div
        ref={resultEndRef}
        style={{
          position: "absolute",
          top: "-50vh",
          height: "1px"
        }}
      ></div>
    </div>
  )
}
