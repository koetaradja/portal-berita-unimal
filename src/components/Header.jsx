import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { NAV_ITEMS } from '../data/constants'
import { useAuth } from '../hooks/useAuth'

export default function Header({ primaryColor = "#1B6B3A", accentColor = "#E8A020", onLoginClick }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuth()

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User'
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const handleNav = (slug) => {
    if (slug === 'beranda') navigate('/')
    else if (slug === 'tentang') navigate('/tentang')
    else navigate(`/kategori/${slug}`)
  }

  const currentDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 200, boxShadow: "0 2px 10px rgba(0,0,0,0.13)" }}>
      <div style={{ background: "#111", color: "#999", fontSize: "12px", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 34 }}>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <span>{currentDate}</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span>Lhokseumawe, Aceh Utara</span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="https://unimal.ac.id" target="_blank" rel="noreferrer" style={{ color: "#999", textDecoration: "none", fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em" }}>UNIMAL.AC.ID ↗</a>
          <a href="https://siakad.unimal.ac.id" target="_blank" rel="noreferrer" style={{ color: "#999", textDecoration: "none", fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em" }}>SIAKAD</a>
        </div>
      </div>

      <div style={{ background: "#fff", padding: "10px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #EBEBEB" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, cursor: "pointer" }} onClick={() => navigate('/')}>
          <img src="/Logo-Unimal-Aceh_Utara.png" alt="Universitas Malikussaleh" style={{ height: 54, width: "auto" }} />
          <div style={{ borderLeft: "2px solid #E5E5E5", paddingLeft: 20 }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.13em", textTransform: "uppercase", color: "#999", fontWeight: 600 }}>Universitas Malikussaleh</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "24px", fontWeight: 700, color: "#1A1A1A", lineHeight: 1.15, marginTop: 2 }}>Ilmu Komunikasi</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {searchOpen ? (
            <input autoFocus type="text" placeholder="Cari berita, topik, atau penulis…"
              style={{ border: "none", borderBottom: `2px solid ${primaryColor}`, outline: "none", padding: "5px 4px", fontSize: "14px", width: 260, background: "transparent" }}
              onBlur={() => setSearchOpen(false)} />
          ) : (
            <button onClick={() => setSearchOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 7, color: "#555", display: "flex" }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          )}

          {user ? (
            <>
              <button onClick={() => navigate('/editor')} style={{ background: accentColor, color: "#fff", padding: "8px 18px", fontWeight: 700, fontSize: "13px", letterSpacing: "0.03em", display: "flex", alignItems: "center", gap: 7, border: "none", cursor: "pointer" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Tulis Berita
              </button>
              <div className="user-menu" ref={menuRef}>
                <div onClick={() => setUserMenuOpen(!userMenuOpen)} style={{ width: 38, height: 38, borderRadius: "50%", background: primaryColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, cursor: "pointer", userSelect: "none" }}>
                  {initials}
                </div>
                {userMenuOpen && (
                  <div className="user-dropdown">
                    <div style={{ padding: "12px 18px 10px", borderBottom: "1px solid #EBEBEB" }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#1A1A1A" }}>{displayName}</div>
                      <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{user.email}</div>
                    </div>
                    <span className="user-dropdown-item" onClick={() => { navigate('/editor'); setUserMenuOpen(false) }}>✏ Tulis Berita Baru</span>
                    <span className="user-dropdown-item" style={{ color: "#888" }}>📄 Artikel Saya</span>
                    <div style={{ borderTop: "1px solid #EBEBEB", marginTop: 4, paddingTop: 4 }}>
                      <span className="user-dropdown-item" style={{ color: "#C44" }} onClick={() => { signOut(); setUserMenuOpen(false) }}>↩ Keluar</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button onClick={onLoginClick}
              style={{ background: primaryColor, color: "#fff", border: "none", padding: "8px 22px", fontWeight: 700, fontSize: "14px", cursor: "pointer", letterSpacing: "0.02em", display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Login
            </button>
          )}
        </div>
      </div>

      <nav style={{ background: primaryColor, display: "flex", padding: "0 20px", overflowX: "auto" }}>
        {NAV_ITEMS.map(item => (
          <div key={item.slug} className="nav-item" onClick={() => handleNav(item.slug)}>{item.label}</div>
        ))}
      </nav>
    </header>
  )
}
