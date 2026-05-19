import Header from '../components/Header'
import Footer from '../components/Footer'
import { TERMS } from '../data/constants'
import { Link } from 'react-router-dom'

export default function SyaratKetentuan() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F5F5F3', fontFamily: "'Source Sans 3', sans-serif" }}>
      <Header primaryColor="#1B6B3A" accentColor="#E8A020" />
      
      <div style={{ background: 'rgba(0,0,0,.05)', padding: '36px 28px 32px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 11, letterSpacing: '.13em', textTransform: 'uppercase', opacity: .6, marginBottom: 10 }}>Dokumen Kebijakan</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 'clamp(26px,4vw,42px)', lineHeight: 1.15, color: '#1A1A1A' }}>Syarat dan Ketentuan<br />Penggunaan Portal Berita</h1>
          <p style={{ marginTop: 14, fontSize: 15, opacity: .8, maxWidth: 580, lineHeight: 1.65 }}>Portal Berita Mahasiswa — Prodi Ilmu Komunikasi, Fakultas Ilmu Sosial dan Ilmu Politik, Universitas Malikussaleh</p>
        </div>
      </div>

      <main style={{ flex: 1, maxWidth: 900, margin: '0 auto', padding: '40px 28px', width: '100%' }}>
        <div style={{ background: '#fff', borderLeft: '5px solid #1B6B3A', padding: '24px 28px', marginBottom: 36 }}>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: '#333' }}>
            Dengan menggunakan Portal Berita Ilmu Komunikasi dan menerbitkan artikel di platform ini, pengguna (selanjutnya disebut <strong>"Penulis"</strong>) dianggap telah membaca, memahami, dan <strong>menyetujui seluruh syarat dan ketentuan</strong> yang tercantum di bawah ini.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 48 }}>
          {TERMS.map((term, i) => (
            <div key={i} style={{ background: '#fff', padding: '28px 32px', borderTop: `4px solid ${i % 2 === 0 ? '#1B6B3A' : '#E8A020'}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                <div style={{ width: 52, height: 52, background: i % 2 === 0 ? '#1B6B3A' : '#E8A020', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 900, flexShrink: 0 }}>{i + 1}</div>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, marginBottom: 10, color: '#1A1A1A' }}>Ketentuan Publikasi {i + 1}</h2>
                  <p style={{ fontSize: 15, lineHeight: 1.8, color: '#444' }}>{term}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#1B6B3A', color: '#fff', padding: '36px 40px', marginBottom: 48, textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, marginBottom: 14 }}>Pertanyaan dan Klarifikasi</h2>
          <p style={{ fontSize: 16, opacity: .85, lineHeight: 1.7, maxWidth: 560, margin: '0 auto 24px' }}>Jika ada pertanyaan tentang syarat dan ketentuan ini, hubungi tim redaksi portal melalui:</p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,.12)', padding: '14px 24px', fontSize: 15 }}>📧 <strong>ilkom@fisip.unimal.ac.id</strong></div>
            <div style={{ background: 'rgba(255,255,255,.12)', padding: '14px 24px', fontSize: 15 }}>📍 <strong>Gedung Fisip Unimal, Lhokseumawe</strong></div>
          </div>
          <div style={{ marginTop: 28, display: 'flex', gap: 16, justifyContent: 'center' }}>
            <Link to="/editor" style={{ background: '#E8A020', color: '#fff', textDecoration: 'none', padding: '13px 36px', fontWeight: 700, fontSize: 15 }}>✓ Kembali ke Editor</Link>
            <Link to="/" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', textDecoration: 'none', border: '2px solid rgba(255,255,255,.35)', padding: '13px 36px', fontWeight: 700, fontSize: 15 }}>← Beranda Portal</Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
