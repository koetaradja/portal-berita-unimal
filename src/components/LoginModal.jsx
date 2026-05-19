import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function LoginModal({ onClose, primaryColor = "#1B6B3A" }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) { setError('Email dan kata sandi wajib diisi.'); return }
    setLoading(true); setError('')
    try {
      await signIn(email, password)
      onClose()
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa email dan password Anda.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(3px)" }}></div>
      <div className="modal-in" onClick={e => e.stopPropagation()} style={{ position: "relative", background: "#fff", width: "100%", maxWidth: 400, padding: "44px 40px 36px", zIndex: 1 }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#999", lineHeight: 1 }}>×</button>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <img src="/Logo-Unimal-Aceh_Utara.png" alt="Unimal" style={{ height: 52, marginBottom: 14 }} />
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 22, color: "#1A1A1A" }}>Masuk ke Portal Ilkom</h2>
          <p style={{ fontSize: 13, color: "#888", marginTop: 6 }}>Login menggunakan akun mahasiswa Unimal</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#888", display: "block", marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="nim@mhs.unimal.ac.id"
              style={{ width: "100%", border: "1px solid #E2E2E2", padding: "10px 14px", fontSize: 14, outline: "none", fontFamily: "'Source Sans 3',sans-serif", transition: "border-color 0.15s", borderRadius: 0 }}
              onFocus={e => e.target.style.borderColor = primaryColor} onBlur={e => e.target.style.borderColor = "#E2E2E2"} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#888", display: "block", marginBottom: 6 }}>Kata Sandi</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", border: "1px solid #E2E2E2", padding: "10px 14px", fontSize: 14, outline: "none", fontFamily: "'Source Sans 3',sans-serif", borderRadius: 0 }}
              onFocus={e => e.target.style.borderColor = primaryColor} onBlur={e => e.target.style.borderColor = "#E2E2E2"} />
          </div>
          {error && <p style={{ fontSize: 13, color: "#D44", background: "#FEF0F0", padding: "8px 12px" }}>{error}</p>}
          <button type="submit" disabled={loading}
            style={{ background: loading ? "#aaa" : primaryColor, color: "#fff", border: "none", padding: "12px 20px", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Source Sans 3',sans-serif", letterSpacing: "0.03em", transition: "opacity 0.15s", marginTop: 4 }}>
            {loading ? "Memverifikasi…" : "Masuk"}
          </button>
          <p style={{ fontSize: 12, textAlign: "center", color: "#AAA" }}>
            <a href="#" style={{ color: "#888", textDecoration: "none" }}>Lupa kata sandi?</a>
            &nbsp;·&nbsp;
            <a href="#" style={{ color: primaryColor, textDecoration: "none", fontWeight: 600 }}>Hubungi admin prodi</a>
          </p>
        </form>
      </div>
    </div>
  )
}
