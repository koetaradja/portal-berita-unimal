export default function Footer({ primaryColor = "#1B6B3A" }) {
  const cols = [
    { title: "Kategori", links: ["Politik", "Olahraga", "Teknologi", "Lokal Aceh", "Internasional", "Hiburan"] },
    { title: "Prodi", links: ["Tentang Ilkom", "Dosen & Staf", "Kurikulum", "Fasilitas", "Akreditasi"] },
    { title: "Tautan", links: ["Website Unimal", "SIAKAD", "E-Learning", "Perpustakaan", "PMB Unimal"] }
  ]
  return (
    <footer style={{ background: "#0F0F0F", color: "#888", marginTop: 64 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "52px 28px 36px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 44 }} className="footer-cols">
        <div>
          <img src="/Logo-Unimal-Aceh_Utara.png" alt="Unimal" style={{ height: 52, filter: "brightness(0) invert(1)", opacity: 0.75, marginBottom: 16 }} />
          <p style={{ fontSize: 13, lineHeight: 1.75, maxWidth: 280, color: "#666" }}>Portal berita resmi mahasiswa Program Studi Ilmu Komunikasi, Fakultas Ilmu Sosial dan Ilmu Politik, Universitas Malikussaleh.</p>
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            {[["IG", "Instagram"], ["YT", "YouTube"], ["TW", "Twitter/X"], ["FB", "Facebook"]].map(([abbr, label]) => (
              <a key={abbr} href="#" title={label} style={{ width: 34, height: 34, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", textDecoration: "none", fontSize: 11, fontWeight: 700, transition: "all 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.background = primaryColor; e.currentTarget.style.color = "#fff" }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#888" }}>{abbr}</a>
            ))}
          </div>
        </div>
        {cols.map(col => (
          <div key={col.title}>
            <h4 style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#ddd", marginBottom: 16, fontWeight: 700 }}>{col.title}</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {col.links.map(l => (
                <li key={l}><a href="#" style={{ color: "#666", textDecoration: "none", fontSize: 13, transition: "color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#E8A020"} onMouseLeave={e => e.currentTarget.style.color = "#666"}>{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #1e1e1e", padding: "18px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1280, margin: "0 auto", fontSize: 12, flexWrap: "wrap", gap: 8 }}>
        <span>© 2026 Portal Berita Ilmu Komunikasi — Universitas Malikussaleh. Hak cipta dilindungi.</span>
        <span style={{ color: "#E8A020", fontWeight: 600 }}>Akreditasi Unggul BAN-PT</span>
      </div>
    </footer>
  )
}
