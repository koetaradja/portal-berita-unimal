import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ARTICLES, NAV_ITEMS } from '../data/constants'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ArticleCardMedium } from '../components/ArticleCard'
import ArticleModal from '../components/ArticleModal'
import LoginModal from '../components/LoginModal'

export default function CategoryPage() {
  const { slug } = useParams()
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [showLogin, setShowLogin] = useState(false)

  const colorMap = { politik: "#1B6B3A", olahraga: "#1B6B3A", teknologi: "#D49408", lokal: "#1B6B3A", internasional: "#1B3A6B", hiburan: "#8B4A12" }
  const filtered = ARTICLES.filter(a => a.categorySlug === slug)
  const bgColor = colorMap[slug] || "#1B6B3A"
  const title = NAV_ITEMS.find(n => n.slug === slug)?.label || slug

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header primaryColor="#1B6B3A" accentColor="#E8A020" onLoginClick={() => setShowLogin(true)} />
      <main style={{ flex: 1 }}>
        <div className="fade-in">
          <div style={{ background: bgColor, color: "#fff", padding: "36px 28px 30px" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
              <p style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.65, marginBottom: 8 }}>Kategori Berita</p>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "38px" }}>{title}</h1>
              <p style={{ fontSize: "14px", opacity: 0.75, marginTop: 8 }}>{filtered.length} artikel tersedia</p>
            </div>
          </div>
          <div style={{ maxWidth: 1280, margin: "44px auto", padding: "0 28px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 36 }} className="three-col">
              {filtered.map(art => <ArticleCardMedium key={art.id} article={art} onClick={setSelectedArticle} />)}
            </div>
            {filtered.length === 0 && <p style={{ textAlign: "center", padding: 80, color: "#aaa", fontSize: 18 }}>Belum ada artikel.</p>}
          </div>
        </div>
      </main>
      <Footer primaryColor="#1B6B3A" />
      <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  )
}
