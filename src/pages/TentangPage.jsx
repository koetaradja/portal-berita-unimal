import Header from '../components/Header'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import { useState } from 'react'

const P = "#1B6B3A"
const A = "#E8A020"

export default function TentangPage() {
  const [showLogin, setShowLogin] = useState(false)
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header primaryColor={P} accentColor={A} onLoginClick={() => setShowLogin(true)} />
      <main style={{ flex: 1 }}>
        <div className="fade-in">
          <div style={{ background: P, color: "#fff", padding: "64px 28px", textAlign: "center" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.6, marginBottom: 14 }}>Program Studi — FISIP Unimal</p>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,5vw,50px)", fontWeight: 700 }}>Ilmu Komunikasi</h1>
            <p style={{ fontSize: 17, opacity: 0.82, marginTop: 18, lineHeight: 1.7, maxWidth: 560, margin: "18px auto 0" }}>Portal berita mahasiswa Prodi Ilmu Komunikasi, Universitas Malikussaleh — wadah berlatih jurnalisme nyata.</p>
            <div style={{ marginTop: 24, display: "inline-block", background: A, padding: "8px 24px", fontWeight: 700, fontSize: 13, letterSpacing: "0.05em" }}>★ AKREDITASI UNGGUL — BAN-PT 2026</div>
          </div>
          <div style={{ maxWidth: 900, margin: "52px auto", padding: "0 28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }} className="large-card-grid">
            <div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, borderTop: `3px solid ${P}`, paddingTop: 14, marginBottom: 18 }}>Tentang Portal</h2>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "#444", marginBottom: 16 }}>Portal berita ini adalah media latihan jurnalisme bagi mahasiswa Prodi Ilmu Komunikasi Unimal. Setiap mahasiswa dapat login, menulis, dan menerbitkan berita yang sudah diverifikasi oleh dosen pembimbing.</p>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "#444" }}>Berita yang diterbitkan mencakup topik lokal Aceh, nasional, hingga internasional — sebagai bagian dari kurikulum praktik jurnalistik.</p>
            </div>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, borderTop: `3px solid ${A}`, paddingTop: 14, marginBottom: 18 }}>Cara Berpartisipasi</h2>
              {["Login menggunakan akun mahasiswa Unimal", "Klik 'Tulis Berita' di pojok kanan atas", "Tulis artikel, tambahkan foto dan kategori", "Klik 'Terbitkan' — artikel masuk antrian editorial", "Dosen mereview dan menyetujui artikel"].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 14, padding: "10px 0", borderBottom: "1px solid #F0F0F0" }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: P, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontSize: 14, color: "#333", lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer primaryColor={P} />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} primaryColor={P} />}
    </div>
  )
}
