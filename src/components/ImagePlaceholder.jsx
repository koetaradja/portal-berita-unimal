// --- Image Placeholder ---
export function ImagePlaceholder({ desc, aspect = "56.25%", className = "" }) {
  const patternId = `stripe-${desc?.slice(0, 4) || 'def'}-${Math.random().toString(36).slice(2, 6)}`
  return (
    <div className={`img-placeholder ${className}`} style={{ paddingBottom: aspect, position: "relative", overflow: "hidden", background: "#e8e8e6" }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={patternId} width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="12" fill="#d8d8d6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        <rect width="100%" height="100%" fill="rgba(20,60,30,0.08)" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "12px", textAlign: "center" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 8, opacity: 0.4 }}>
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="#333" strokeWidth="1.5"/>
          <circle cx="8.5" cy="8.5" r="1.5" fill="#333"/>
          <path d="M21 15l-5-5L5 21" stroke="#333" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: "11px", color: "#555", fontStyle: "italic", lineHeight: 1.4, maxWidth: 200, opacity: 0.8 }}>{desc}</span>
      </div>
    </div>
  )
}

// --- Category Badge ---
export function CategoryBadge({ label, slug, size = "sm" }) {
  const colors = {
    politik: { bg: "#1B6B3A", text: "#fff" },
    olahraga: { bg: "#1B6B3A", text: "#fff" },
    teknologi: { bg: "#D49408", text: "#fff" },
    lokal: { bg: "#1B6B3A", text: "#fff" },
    internasional: { bg: "#1B3A6B", text: "#fff" },
    hiburan: { bg: "#8B4A12", text: "#fff" },
    default: { bg: "#1C1C1C", text: "#fff" }
  }
  const c = colors[slug] || colors.default
  const fontSize = size === "lg" ? "13px" : "11px"
  const padding = size === "lg" ? "5px 14px" : "3px 10px"
  return (
    <span style={{ display: "inline-block", background: c.bg, color: c.text, fontFamily: "'Source Sans 3',sans-serif", fontWeight: 700, fontSize, padding, letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1.5 }}>{label}</span>
  )
}
