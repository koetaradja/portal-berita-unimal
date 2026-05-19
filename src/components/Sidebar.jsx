import { CategoryBadge } from './ImagePlaceholder'

export function SidebarEvents({ events }) {
  return (
    <aside style={{ borderTop: "3px solid #1B6B3A", paddingTop: 14 }}>
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "18px", marginBottom: 20, color: "#1A1A1A" }}>Agenda Mendatang</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {events.map(ev => (
          <div key={ev.id} style={{ display: "flex", gap: 14, alignItems: "flex-start", paddingBottom: 16, borderBottom: "1px solid #EBEBEB" }}>
            <div style={{ flex: "0 0 52px", background: "#1B6B3A", color: "#fff", textAlign: "center", padding: "8px 4px 6px" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "22px", lineHeight: 1 }}>{ev.date}</div>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", marginTop: 3, opacity: 0.85 }}>{ev.month}</div>
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: "13px", lineHeight: 1.4, color: "#1A1A1A" }}>{ev.title}</p>
              <p style={{ fontSize: "12px", color: "#888", marginTop: 4 }}>{ev.time}</p>
              <p style={{ fontSize: "12px", color: "#888" }}>{ev.location}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

export function SidebarPopular({ articles, onClick }) {
  return (
    <aside style={{ borderTop: "3px solid #D49408", paddingTop: 14, marginTop: 32 }}>
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "18px", marginBottom: 20, color: "#1A1A1A" }}>Paling Banyak Dibaca</h3>
      {articles.map((art, i) => (
        <div key={art.id} onClick={() => onClick?.(art)} style={{ display: "flex", gap: 14, cursor: "pointer", paddingBottom: 16, marginBottom: 16, borderBottom: "1px solid #EBEBEB" }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "32px", color: "#EBEBEB", lineHeight: 1, flex: "0 0 32px" }}>{i + 1}</span>
          <div>
            <CategoryBadge label={art.category} slug={art.categorySlug} />
            <p className="article-headline-hover" style={{ fontWeight: 600, fontSize: "13px", lineHeight: 1.45, color: "#1A1A1A", marginTop: 5 }}>{art.title}</p>
          </div>
        </div>
      ))}
    </aside>
  )
}
