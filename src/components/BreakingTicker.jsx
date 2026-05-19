import { useState, useEffect } from 'react'

export default function BreakingTicker({ messages, color = "#1B6B3A" }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % messages.length), 9000)
    return () => clearInterval(t)
  }, [messages.length])

  return (
    <div style={{ background: "#1A1A1A", display: "flex", alignItems: "center", height: 36, overflow: "hidden" }}>
      <div style={{ background: color, color: "#fff", padding: "0 18px", height: "100%", display: "flex", alignItems: "center", fontWeight: 700, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", flexShrink: 0, gap: 7 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", display: "inline-block" }}></span>
        Terkini
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <span key={idx} className="ticker-animate" style={{ paddingLeft: 24, fontSize: "13px", color: "#ddd", lineHeight: "36px" }}>{messages[idx]}</span>
      </div>
    </div>
  )
}
