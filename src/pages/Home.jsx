import { useState, useEffect } from 'react'
import { ARTICLES, EVENTS, BREAKING_NEWS, CATEGORIES } from '../data/constants'
import { supabase } from '../lib/supabase'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BreakingTicker from '../components/BreakingTicker'
import { ImagePlaceholder, CategoryBadge } from '../components/ImagePlaceholder'
import { ArticleCardMedium, ArticleCardLarge, ArticleCardSmall } from '../components/ArticleCard'
import { SidebarEvents, SidebarPopular } from '../components/Sidebar'
import ArticleModal from '../components/ArticleModal'
import LoginModal from '../components/LoginModal'

const P = "#1B6B3A"
const A = "#E8A020"

function SectionDivider({ title, slug, onViewAll }) {
  const colors = { politik: "#1B6B3A", olahraga: "#1B6B3A", teknologi: "#D49408", lokal: "#1B6B3A", internasional: "#1B3A6B", hiburan: "#8B4A12" }
  const color = colors[slug] || "#1C1C1C"
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, borderTop: `3px solid ${color}`, paddingTop: 14 }}>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "22px", color: "#1A1A1A" }}>{title}</h2>
      <button onClick={onViewAll} style={{ background: "none", border: `1px solid ${color}`, color, padding: "5px 18px", fontWeight: 600, fontSize: "13px", cursor: "pointer", letterSpacing: "0.03em", transition: "all 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = "#fff" }}
        onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = color }}>Lihat Semua →</button>
    </div>
  )
}

function CategoryBlock({ title, slug, articles, onArticleClick, onViewAll }) {
  const first = articles[0]; const rest = articles.slice(1, 3)
  if (!first) return null
  return (
    <section style={{ marginBottom: 52 }}>
      <SectionDivider title={title} slug={slug} onViewAll={onViewAll} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="large-card-grid">
        <ArticleCardLarge article={first} onClick={onArticleClick} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          {rest.map(art => <ArticleCardSmall key={art.id} article={art} onClick={onArticleClick} />)}
        </div>
      </div>
    </section>
  )
}

function HeroSection({ articles, onArticleClick }) {
  const hero = articles[0]
  const secondary = articles.slice(1, 3)
  const gridItems = articles.slice(3, 6)
  
  if (!hero) return null;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 3, background: "#111" }}>
        <div onClick={() => onArticleClick(hero)} style={{ position: "relative", cursor: "pointer", overflow: "hidden", minHeight: 420 }}>
          {hero.coverUrl ? (
            <img src={hero.coverUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
          ) : (
            <ImagePlaceholder desc={hero.imageDesc || hero.title} aspect="54%" />
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,28,16,0.96) 0%, rgba(8,28,16,0.5) 52%, rgba(0,0,0,0.04) 100%)" }}></div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 40px", zIndex: 2 }}>
            <CategoryBadge label={hero.category} slug={hero.categorySlug} size="lg" />
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "clamp(24px,3.2vw,42px)", lineHeight: 1.18, color: "#fff", marginTop: 13, textShadow: "0 2px 14px rgba(0,0,0,0.45)" }}>{hero.title}</h1>
            <p style={{ marginTop: 13, fontSize: "16px", color: "rgba(255,255,255,0.82)", lineHeight: 1.65, maxWidth: 540, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{hero.excerpt}</p>
            <div style={{ marginTop: 16, fontSize: "13px", color: "rgba(255,255,255,0.55)", display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>{hero.author}</span>
              <span>·</span><span>{hero.date}</span><span>·</span><span>{hero.readTime || '3 mnt'} baca</span>
            </div>
          </div>
        </div>
        <div className="hero-right" style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {secondary.map(art => (
            <div key={art.id} onClick={() => onArticleClick(art)} style={{ flex: 1, position: "relative", overflow: "hidden", cursor: "pointer", minHeight: 160 }}>
              {art.coverUrl ? (
                <img src={art.coverUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
              ) : (
                <ImagePlaceholder desc={art.imageDesc || art.title} aspect="100%" />
              )}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,28,16,0.92) 0%, rgba(0,0,0,0.18) 65%)" }}></div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 22px" }}>
                <CategoryBadge label={art.category} slug={art.categorySlug} />
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "15px", lineHeight: 1.32, color: "#fff", marginTop: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{art.title}</h3>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", marginTop: 5 }}>{art.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "#F5F5F3", padding: "32px 28px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }} className="three-col">
          {gridItems.map(art => <ArticleCardMedium key={art.id} article={art} onClick={onArticleClick} />)}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [allArticles, setAllArticles] = useState(ARTICLES) // default to static data

  useEffect(() => {
    async function fetchDynamicArticles() {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        if (data && data.length > 0) {
          const dynamicFormatted = data.map(a => ({
            id: a.id,
            title: a.title,
            excerpt: a.subtitle || '',
            body: a.body, // full HTML content
            category: CATEGORIES.find(c => c.slug === a.category)?.label || a.category,
            categorySlug: a.category,
            author: a.author_name || 'Mahasiswa Ilkom',
            date: new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            readTime: '3 mnt',
            coverUrl: a.cover_url,
            imageDesc: a.title,
            section: 'dynamic'
          }))
          
          // Merge dynamic articles with static ones
          setAllArticles([...dynamicFormatted, ...ARTICLES])
        }
      } catch (err) {
        console.error("Failed to fetch articles:", err)
      }
    }
    fetchDynamicArticles()
  }, [])

  const sectionArticles = slug => allArticles.filter(a => a.categorySlug === slug)

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <BreakingTicker messages={BREAKING_NEWS} color={P} />
      <Header primaryColor={P} accentColor={A} onLoginClick={() => setShowLogin(true)} />
      <main style={{ flex: 1 }}>
        <div className="fade-in">
          <HeroSection articles={allArticles} onArticleClick={setSelectedArticle} />
          <div style={{ maxWidth: 1280, margin: "52px auto 0", padding: "0 28px", display: "grid", gridTemplateColumns: "1fr 310px", gap: 52 }} className="main-two-col">
            <div>
              <CategoryBlock title="Politik" slug="politik" articles={sectionArticles("politik")} onArticleClick={setSelectedArticle} onViewAll={() => window.location.href = '/kategori/politik'} />
              <CategoryBlock title="Olahraga" slug="olahraga" articles={sectionArticles("olahraga")} onArticleClick={setSelectedArticle} onViewAll={() => window.location.href = '/kategori/olahraga'} />
              <CategoryBlock title="Teknologi" slug="teknologi" articles={sectionArticles("teknologi")} onArticleClick={setSelectedArticle} onViewAll={() => window.location.href = '/kategori/teknologi'} />
              <CategoryBlock title="Lokal Aceh" slug="lokal" articles={sectionArticles("lokal")} onArticleClick={setSelectedArticle} onViewAll={() => window.location.href = '/kategori/lokal'} />
            </div>
            <aside>
              <SidebarEvents events={EVENTS} />
              <SidebarPopular articles={allArticles.slice(0, 5)} onClick={setSelectedArticle} />
            </aside>
          </div>
        </div>
      </main>
      <Footer primaryColor={P} />
      <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} primaryColor={P} />}
    </div>
  )
}
