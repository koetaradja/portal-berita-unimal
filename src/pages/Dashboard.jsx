import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    fetchMyArticles()
  }, [user, navigate])

  async function fetchMyArticles() {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('articles')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false })
      
      if (fetchError) throw fetchError
      setArticles(data || [])
    } catch (err) {
      console.error("Error fetching articles:", err)
      setError("Gagal memuat artikel Anda. Pastikan database Supabase sudah di-setup.")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Apakah Anda yakin ingin menghapus artikel ini?")) return
    try {
      const { error: delError } = await supabase.from('articles').delete().eq('id', id)
      if (delError) throw delError
      setArticles(articles.filter(a => a.id !== id))
    } catch (err) {
      alert("Gagal menghapus artikel: " + err.message)
    }
  }

  function getStatusBadge(status) {
    const styles = {
      published: { bg: '#E8F4ED', color: '#1B6B3A', label: 'Terbit' },
      pending: { bg: '#FFF8E1', color: '#D49408', label: 'Menunggu Review' },
      draft: { bg: '#F5F5F3', color: '#666', label: 'Draft' },
      rejected: { bg: '#FEE2E2', color: '#D32F2F', label: 'Ditolak' }
    }
    const s = styles[status] || styles.draft
    return (
      <span style={{ background: s.bg, color: s.color, padding: '4px 10px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>
        {s.label}
      </span>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FAFAFA' }}>
      <Header primaryColor="#1B6B3A" accentColor="#E8A020" />
      
      <main style={{ flex: 1, maxWidth: 1000, margin: '0 auto', padding: '40px 28px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, borderBottom: '2px solid #EBEBEB', paddingBottom: 16 }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 32, color: '#1A1A1A' }}>Artikel Saya</h1>
            <p style={{ fontSize: 14, color: '#666', marginTop: 4 }}>Kelola berita yang telah Anda tulis.</p>
          </div>
          <button onClick={() => navigate('/editor')} style={{ background: '#1B6B3A', color: '#fff', border: 'none', padding: '10px 20px', fontWeight: 700, fontSize: 14, borderRadius: 4, cursor: 'pointer' }}>
            + Tulis Berita Baru
          </button>
        </div>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#D32F2F', padding: 16, borderRadius: 4, marginBottom: 24, fontSize: 14 }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>Memuat artikel...</div>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, background: '#fff', border: '1px dashed #CCC', borderRadius: 8 }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📝</div>
            <h3 style={{ fontSize: 18, color: '#333', marginBottom: 8 }}>Belum Ada Artikel</h3>
            <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>Anda belum menulis berita apapun ke database.</p>
            <button onClick={() => navigate('/editor')} style={{ background: '#E8A020', color: '#fff', border: 'none', padding: '10px 24px', fontWeight: 700, borderRadius: 4, cursor: 'pointer' }}>
              Mulai Menulis
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {articles.map(art => (
              <div key={art.id} style={{ background: '#fff', border: '1px solid #EBEBEB', borderRadius: 8, padding: 20, display: 'flex', gap: 20, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                    {getStatusBadge(art.status)}
                    <span style={{ fontSize: 12, color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>{art.category}</span>
                    <span style={{ fontSize: 12, color: '#AAA' }}>• {new Date(art.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 18, color: '#1A1A1A', marginBottom: 6 }}>{art.title}</h3>
                  <p style={{ fontSize: 14, color: '#666', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{art.subtitle}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => navigate(`/editor?id=${art.id}`)} style={{ background: '#F5F5F3', border: '1px solid #E2E2E2', padding: '8px 16px', fontSize: 13, fontWeight: 700, color: '#333', borderRadius: 4, cursor: 'pointer' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(art.id)} style={{ background: '#fff', border: '1px solid #FCA5A5', padding: '8px 16px', fontSize: 13, fontWeight: 700, color: '#D32F2F', borderRadius: 4, cursor: 'pointer' }}>
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer primaryColor="#1B6B3A" />
    </div>
  )
}
