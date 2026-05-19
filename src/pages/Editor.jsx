import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES, TERMS } from '../data/constants'
import { useAuth } from '../hooks/useAuth'
import { checkArticleWithGemini } from '../lib/gemini'

// --- Check Modal ---
function CheckModal({ issues, onBack, onContinue, score, summary, loading, onCheckGemini }) {
  const hasError = issues.some(i => i.severity === 'error' || i.type === 'error')
  const icons = { error: '🚫', warning: '⚠️', info: 'ℹ️' }
  const colors = { error: '#FEE2E2', warning: '#FFF8E1', info: '#EBF5FF' }
  const borders = { error: '#FCA5A5', warning: '#FCD34D', info: '#93C5FD' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="modal-enter" style={{ background: '#fff', maxWidth: 600, width: '100%', padding: '36px 36px 28px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>{hasError ? '🚫' : '⚠️'}</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{hasError ? 'Ada Kesalahan yang Perlu Diperbaiki' : 'Perhatian Sebelum Terbit'}</h2>
        
        {/* Gemini Integration Section */}
        <div style={{ background: '#F8F9FA', padding: 16, borderRadius: 8, marginBottom: 20, border: '1px solid #E9ECEF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>✨ AI Editor Check (Gemini Flash)</h3>
            <button 
              onClick={onCheckGemini} 
              disabled={loading}
              style={{ background: '#1B6B3A', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Memeriksa...' : 'Cek Ejaan & Tata Bahasa'}
            </button>
          </div>
          {score !== null && (
            <div style={{ background: '#fff', padding: 12, borderRadius: 4, border: '1px solid #DEE2E6' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: score >= 80 ? '#1B6B3A' : score >= 60 ? '#D49408' : '#D32F2F', marginBottom: 8 }}>
                Skor Kualitas: {score}/100
              </div>
              <div style={{ fontSize: 14, color: '#495057' }}>{summary}</div>
            </div>
          )}
        </div>

        <p style={{ fontSize: 14, color: '#777', marginBottom: 20 }}>Sistem mendeteksi hal berikut pada artikel Anda:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {issues.length === 0 ? (
             <div style={{ padding: '12px 14px', background: '#F0FAF4', border: `1px solid #1B6B3A`, borderRadius: 3, color: '#1B6B3A' }}>
               ✓ Tidak ada masalah terdeteksi.
             </div>
          ) : issues.map((issue, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 14px', background: colors[issue.severity || issue.type] || colors.info, border: `1px solid ${borders[issue.severity || issue.type] || borders.info}`, borderRadius: 3 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{icons[issue.severity || issue.type] || icons.info}</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 14, lineHeight: 1.55, color: '#333', fontWeight: 'bold' }}>{issue.msg || issue.original}</span>
                {issue.suggestion && <span style={{ fontSize: 13, color: '#1B6B3A', marginTop: 4 }}>Saran: {issue.suggestion}</span>}
                {issue.explanation && <span style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{issue.explanation}</span>}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onBack} style={{ flex: 1, background: '#F5F5F3', border: '1px solid #E2E2E2', padding: '11px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>← Kembali Perbaiki</button>
          {!hasError && <button onClick={onContinue} style={{ flex: 1, background: '#D49408', color: '#fff', border: 'none', padding: '11px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Lanjut ke Persetujuan →</button>}
        </div>
      </div>
    </div>
  )
}

// --- Terms Modal ---
function TermsModal({ onBack, onPublish }) {
  const [agreed, setAgreed] = useState(false)
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="modal-enter" style={{ background: '#fff', maxWidth: 580, width: '100%', padding: '36px 36px 28px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Syarat dan Ketentuan Publikasi</h2>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>Baca dan setujui seluruh ketentuan berikut sebelum menerbitkan artikel.</p>
        <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #E5E5E5', padding: '16px 18px', marginBottom: 18, background: '#FAFAFA' }}>
          {TERMS.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: i < 9 ? '1px solid #EBEBEB' : 'none' }}>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#1B6B3A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ fontSize: 14, lineHeight: 1.65, color: '#333' }}>{t}</span>
            </div>
          ))}
          <div style={{ marginTop: 14, padding: '10px 14px', background: '#FFF8E1', border: '1px solid #FCD34D', fontSize: 13, color: '#7A6020' }}>
            📋 Versi lengkap tersedia di <a href="/syarat-ketentuan" target="_blank" style={{ color: '#1B6B3A', fontWeight: 700 }}>halaman Syarat & Ketentuan ↗</a>
          </div>
        </div>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px', background: agreed ? '#F0FAF4' : '#FAFAFA', border: `2px solid ${agreed ? '#1B6B3A' : '#E2E2E2'}`, cursor: 'pointer', marginBottom: 18, transition: 'all .2s' }}>
          <div onClick={() => setAgreed(!agreed)} style={{ width: 24, height: 24, border: `2px solid ${agreed ? '#1B6B3A' : '#CCC'}`, background: agreed ? '#1B6B3A' : '#fff', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all .2s' }}>
            {agreed && <span style={{ color: '#fff', fontSize: 16, fontWeight: 900 }}>✓</span>}
          </div>
          <span style={{ fontSize: 14, lineHeight: 1.6, color: '#333' }}>Saya telah membaca, memahami, dan <strong>menyetujui seluruh Syarat dan Ketentuan</strong> yang berlaku.</span>
        </label>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onBack} style={{ flex: 1, background: '#F5F5F3', border: '1px solid #E2E2E2', padding: '12px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>← Kembali</button>
          <button onClick={onPublish} disabled={!agreed} style={{ flex: 2, background: agreed ? '#1B6B3A' : '#CCC', color: '#fff', border: 'none', padding: '12px 0', fontWeight: 700, fontSize: 15, cursor: agreed ? 'pointer' : 'not-allowed' }}>
            {agreed ? '✓ Terbitkan Sekarang' : 'Centang persetujuan dahulu'}
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Success Overlay ---
function SuccessOverlay({ title, category, author, onHome, onNew }) {
  const cat = CATEGORIES.find(c => c.slug === category) || CATEGORIES[0]
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#1B6B3A', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24, overflow: 'hidden' }}>
      <div style={{ fontSize: 13, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', marginBottom: 12 }}>Artikel Diterbitkan!</div>
      <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 'clamp(28px,4vw,52px)', color: '#fff', marginBottom: 16 }}>Selamat! Halaman Berita Anda<br />Sudah Terposting 🎉</h1>
      <div style={{ width: 70, height: 4, background: '#E8A020', margin: '0 auto 24px' }}></div>
      <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', padding: '18px 28px', maxWidth: 560, marginBottom: 28, textAlign: 'left' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: cat.color === '#1B6B3A' ? '#90EEB8' : '#FFD770', marginBottom: 8 }}>{cat.label}</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 20, color: '#fff', marginBottom: 8, lineHeight: 1.3 }}>{title || 'Artikel baru'}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)' }}>Oleh {author || 'Penulis'} · Dalam antrian editorial</div>
      </div>
      <p style={{ fontSize: 15, color: 'rgba(255,255,255,.75)', marginBottom: 32 }}>Artikel sedang dalam proses review editor. Akan tampil di portal dalam 1×24 jam.</p>
      <div style={{ display: 'flex', gap: 16 }}>
        <button onClick={onHome} style={{ background: '#E8A020', color: '#fff', border: 'none', padding: '13px 36px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>← Beranda</button>
        <button onClick={onNew} style={{ background: 'rgba(255,255,255,.15)', color: '#fff', border: '2px solid rgba(255,255,255,.35)', padding: '13px 36px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Tulis Artikel Baru</button>
      </div>
    </div>
  )
}

// --- MAIN EDITOR ---
export default function Editor() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [category, setCategory] = useState('politik')
  const [authorName, setAuthorName] = useState(profile?.full_name || '')
  const [authorNim, setAuthorNim] = useState(profile?.nim || '')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [coverUrl, setCoverUrl] = useState(null)
  const [hasCover, setHasCover] = useState(false)
  const [inlineCount, setInlineCount] = useState(0)
  const [isFeatured, setIsFeatured] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [draftStatus, setDraftStatus] = useState('baru')
  const [lastSaved, setLastSaved] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  
  const [publishStep, setPublishStep] = useState(null) // null | 'check' | 'terms' | 'success'
  const [checkIssues, setCheckIssues] = useState([])
  
  // Gemini State
  const [geminiScore, setGeminiScore] = useState(null)
  const [geminiSummary, setGeminiSummary] = useState('')
  const [geminiLoading, setGeminiLoading] = useState(false)

  const bodyRef = useRef(null)
  const coverFileRef = useRef(null)
  const inlineFileRef = useRef(null)
  const savedRange = useRef(null)

  const totalPhotos = (hasCover ? 1 : 0) + inlineCount

  useEffect(() => {
    // If not logged in, you might want to redirect, but for demo we can allow viewing
    const raw = localStorage.getItem('ilkom-editor-v2')
    if (!raw) return
    try {
      const d = JSON.parse(raw)
      setTitle(d.title || ''); setSubtitle(d.subtitle || ''); setCategory(d.category || 'politik')
      setAuthorName(d.authorName || profile?.full_name || ''); setAuthorNim(d.authorNim || profile?.nim || '')
      setTags(d.tags || []); setIsFeatured(d.isFeatured || false)
      if (d.coverUrl) { setCoverUrl(d.coverUrl); setHasCover(true) }
      if (d.body && bodyRef.current) { bodyRef.current.innerHTML = d.body; updateWordCount() }
      if (d.savedAt) setLastSaved(new Date(d.savedAt))
      setDraftStatus('tersimpan')
    } catch (_) { }
  }, [profile])

  useEffect(() => {
    const t = setInterval(saveDraft, 45000)
    return () => clearInterval(t)
  })

  const saveDraft = useCallback(() => {
    setDraftStatus('menyimpan')
    const draft = {
      title, subtitle, category, authorName, authorNim, tags, isFeatured,
      coverUrl: coverUrl ? coverUrl.slice(0, 150000) : null,
      body: bodyRef.current?.innerHTML || '', savedAt: new Date().toISOString()
    }
    try { localStorage.setItem('ilkom-editor-v2', JSON.stringify(draft)) } catch (_) { }
    setLastSaved(new Date())
    setTimeout(() => setDraftStatus('tersimpan'), 600)
  }, [title, subtitle, category, authorName, authorNim, tags, isFeatured, coverUrl])

  const updateWordCount = () => {
    const text = bodyRef.current?.innerText || ''
    setWordCount(text.trim().split(/\s+/).filter(w => w.length > 0).length)
  }

  const readImageFile = (file, onSuccess, onError) => {
    if (!file || !file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) { onError('Ukuran foto melebihi batas 5 MB. Pilih foto yang lebih kecil.'); return }
    const reader = new FileReader()
    reader.onload = ev => onSuccess(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleCoverFile = file => readImageFile(file, url => { setCoverUrl(url); setHasCover(true) }, alert)
  const handleDrop = e => { e.preventDefault(); setIsDragging(false); if (!hasCover) handleCoverFile(e.dataTransfer.files[0]) }

  const handleInlineClick = () => {
    if (totalPhotos >= 2) { alert('Batas maksimum 2 foto sudah tercapai. Hapus salah satu foto dahulu.'); return }
    const sel = window.getSelection()
    if (sel.rangeCount > 0 && bodyRef.current?.contains(sel.anchorNode)) savedRange.current = sel.getRangeAt(0).cloneRange()
    else savedRange.current = null
    inlineFileRef.current?.click()
  }

  const insertInlineImage = file => {
    readImageFile(file, url => {
      const wrap = document.createElement('div')
      wrap.style.cssText = 'margin:24px 0;position:relative;'
      wrap.setAttribute('contenteditable', 'false')
      const img = document.createElement('img')
      img.src = url; img.setAttribute('data-inline-img', 'true')
      img.style.cssText = 'width:100%;display:block;max-height:480px;object-fit:cover;'
      const btn = document.createElement('button')
      btn.textContent = '× Hapus Foto'
      btn.style.cssText = 'position:absolute;top:8px;right:8px;background:rgba(0,0,0,.6);color:#fff;border:none;padding:5px 12px;cursor:pointer;font-size:13px;font-weight:600;'
      btn.onclick = () => { wrap.remove(); setInlineCount(c => c - 1) }
      wrap.appendChild(img); wrap.appendChild(btn)
      if (savedRange.current) {
        const r = savedRange.current; r.collapse(false); r.insertNode(wrap)
        const nr = document.createRange(); nr.setStartAfter(wrap); nr.collapse(true)
        const s = window.getSelection(); s.removeAllRanges(); s.addRange(nr)
      } else { bodyRef.current?.appendChild(wrap) }
      setInlineCount(c => c + 1); updateWordCount()
    }, alert)
  }

  const format = (cmd, val) => { document.execCommand(cmd, false, val || null); bodyRef.current?.focus() }
  const addTag = () => { const t = tagInput.trim(); if (t && !tags.includes(t) && tags.length < 8) { setTags([...tags, t]); setTagInput('') } }

  const runBasicChecks = () => {
    const issues = []
    const body = bodyRef.current?.innerText || ''
    const words = body.trim().split(/\s+/).filter(Boolean)
    if (!title.trim() || title.trim().length < 10) issues.push({ type: 'error', msg: 'Judul terlalu singkat — minimal 10 karakter' })
    if (!authorName.trim()) issues.push({ type: 'error', msg: 'Nama penulis belum diisi' })
    if (!subtitle.trim()) issues.push({ type: 'warning', msg: 'Ringkasan/teras berita belum diisi' })
    if (words.length < 50) issues.push({ type: 'warning', msg: `Isi berita baru ${words.length} kata — minimal 50 kata direkomendasikan` })
    if (/  +/.test(body)) issues.push({ type: 'warning', msg: 'Terdapat spasi ganda dalam teks' })
    if (body.trim() && !/[.!?]$/.test(body.trim())) issues.push({ type: 'warning', msg: 'Paragraf terakhir sebaiknya diakhiri tanda baca (. ! ?)' })
    if (totalPhotos === 0) issues.push({ type: 'info', msg: 'Belum ada foto — artikel dengan foto lebih menarik pembaca' })
    return issues
  }

  const handlePublishClick = () => {
    const issues = runBasicChecks()
    setCheckIssues(issues)
    setPublishStep('check')
  }

  const handleGeminiCheck = async () => {
    setGeminiLoading(true)
    try {
      const bodyText = bodyRef.current?.innerText || ''
      const res = await checkArticleWithGemini(title, subtitle, bodyText)
      
      setGeminiScore(res.score)
      setGeminiSummary(res.summary)
      
      // Combine basic issues with Gemini issues
      const basicIssues = runBasicChecks()
      setCheckIssues([...basicIssues, ...(res.issues || [])])
      
      if (res.improved_title && res.improved_title !== title) {
        // You could auto-update or just show it as an issue/suggestion
        console.log("Improved Title:", res.improved_title)
      }
    } catch (err) {
      alert("Gagal menghubungi Gemini AI. Pastikan API Key valid.")
    } finally {
      setGeminiLoading(false)
    }
  }

  const resetEditor = () => {
    setTitle(''); setSubtitle(''); setCategory('politik'); setAuthorName(profile?.full_name || ''); setAuthorNim(profile?.nim || '')
    setTags([]); setCoverUrl(null); setHasCover(false); setInlineCount(0)
    setIsFeatured(false); setWordCount(0); setDraftStatus('baru'); setPublishStep(null)
    setGeminiScore(null); setGeminiSummary(''); setCheckIssues([])
    if (bodyRef.current) bodyRef.current.innerHTML = ''
    localStorage.removeItem('ilkom-editor-v2')
  }

  const toolbarItems = [
    { label: 'B', title: 'Bold', style: { fontWeight: 700 }, action: () => format('bold') },
    { label: 'I', title: 'Italic', style: { fontStyle: 'italic' }, action: () => format('italic') },
    { label: 'U', title: 'Underline', style: { textDecoration: 'underline' }, action: () => format('underline') },
    { sep: true },
    { label: 'H2', title: 'Judul 2', action: () => format('formatBlock', 'H2') },
    { label: 'H3', title: 'Judul 3', action: () => format('formatBlock', 'H3') },
    { label: '"', title: 'Kutipan', action: () => format('formatBlock', 'BLOCKQUOTE') },
    { sep: true },
    { label: '≡', title: 'Daftar Poin', action: () => format('insertUnorderedList') },
    { label: '1.', title: 'Daftar Nomor', action: () => format('insertOrderedList') },
    { label: '—', title: 'Garis Pemisah', action: () => format('insertHorizontalRule') },
    { sep: true },
    { label: '📷', title: totalPhotos >= 2 ? 'Batas 2 foto tercapai' : 'Sisipkan foto di sini', action: handleInlineClick, disabled: totalPhotos >= 2 },
    { sep: true },
    { label: '↩', title: 'Undo', action: () => format('undo') },
    { label: '↪', title: 'Redo', action: () => format('redo') },
  ]

  const statusC = { baru: '#999', menyimpan: '#D49408', tersimpan: '#1B6B3A' }
  const statusL = { baru: 'Belum disimpan', menyimpan: 'Menyimpan…', tersimpan: `Tersimpan ${lastSaved ? lastSaved.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''}` }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F2F2F0' }}>
      {/* TOP BAR */}
      <div style={{ background: '#111', color: '#fff', position: 'sticky', top: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 54, gap: 16, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#ccc', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>Beranda
          </button>
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,.15)' }}></div>
          <img src="/Logo-Unimal-Aceh_Utara.png" alt="Unimal" style={{ height: 30, filter: 'brightness(0) invert(1)', opacity: .8 }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#aaa', letterSpacing: '.04em' }}>Editor Berita</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: statusC[draftStatus] }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusC[draftStatus], display: 'inline-block' }}></span>
            {statusL[draftStatus]}
          </div>
          <button onClick={saveDraft} style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', color: '#fff', padding: '7px 18px', fontWeight: 600, fontSize: 13, cursor: 'pointer', borderRadius: 4 }}>
            Simpan Draft
          </button>
          <button onClick={handlePublishClick} style={{ background: '#1B6B3A', border: 'none', color: '#fff', padding: '7px 22px', fontWeight: 700, fontSize: 13, cursor: 'pointer', letterSpacing: '.03em', borderRadius: 4 }}>
            Terbitkan
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 300px', maxWidth: 1200, margin: '0 auto', width: '100%', alignItems: 'start', padding: '0 0 60px' }}>
        {/* LEFT */}
        <div style={{ padding: '32px 40px 40px', background: '#fff', minHeight: 'calc(100vh - 54px)', borderRight: '1px solid #EBEBEB' }}>
          {/* Cover image */}
          <div onDragOver={e => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}
            onClick={() => !hasCover && coverFileRef.current?.click()}
            style={{ marginBottom: 28, position: 'relative', overflow: 'hidden', cursor: hasCover ? 'default' : 'pointer', border: isDragging ? '2px dashed #1B6B3A' : hasCover ? 'none' : '2px dashed #D0D0D0', background: isDragging ? '#F0FAF4' : hasCover ? 'transparent' : '#FAFAFA', transition: 'all .2s', minHeight: hasCover ? 'auto' : 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {hasCover ? (
              <>
                <img src={coverUrl} alt="Cover" style={{ width: '100%', maxHeight: 400, objectFit: 'cover', display: 'block' }} />
                <button onClick={e => { e.stopPropagation(); setCoverUrl(null); setHasCover(false); }} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,.6)', color: '#fff', border: 'none', borderRadius: 2, padding: '5px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Hapus Foto</button>
                <button onClick={e => { e.stopPropagation(); coverFileRef.current?.click(); }} style={{ position: 'absolute', top: 12, right: 108, background: 'rgba(0,0,0,.6)', color: '#fff', border: 'none', borderRadius: 2, padding: '5px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Ganti Foto</button>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '36px 20px' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#CCC" strokeWidth="1.5" style={{ marginBottom: 12, display: 'inline-block' }}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" fill="#CCC" /><path d="M21 15l-5-5L5 21" stroke="#CCC" strokeWidth="1.5" /></svg>
                <p style={{ color: '#AAA', fontSize: 14, fontWeight: 600 }}>Klik atau seret <strong>foto sampul</strong> ke sini</p>
                <p style={{ color: '#CCC', fontSize: 12, marginTop: 4 }}>PNG · JPG · Maks. 5 MB</p>
              </div>
            )}
          </div>
          <input ref={coverFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleCoverFile(e.target.files[0])} />
          <input ref={inlineFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => insertInlineImage(e.target.files[0])} />

          <input value={title} onChange={e => setTitle(e.target.value)} maxLength={160} placeholder="Judul berita yang kuat dan informatif…"
            style={{ width: '100%', border: 'none', outline: 'none', fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 'clamp(22px,3.2vw,36px)', lineHeight: 1.2, color: '#1A1A1A', marginBottom: 4, padding: 0, background: 'transparent' }} />
          <div style={{ fontSize: 11, color: '#CCC', marginBottom: 20, textAlign: 'right' }}>{title.length}/160</div>

          <textarea value={subtitle} onChange={e => setSubtitle(e.target.value)} maxLength={300} placeholder="Teras berita — ringkasan singkat yang menarik pembaca…" rows={2}
            style={{ width: '100%', border: 'none', borderBottom: '1px solid #F0F0F0', outline: 'none', resize: 'none', fontFamily: "'Source Sans 3',sans-serif", fontSize: 17, lineHeight: 1.65, color: '#555', marginBottom: 28, paddingBottom: 16, padding: 0, background: 'transparent' }} />

          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '6px 8px', background: '#F5F5F3', marginBottom: 18, flexWrap: 'wrap', borderRadius: 4 }}>
            {toolbarItems.map((item, i) => item.sep
              ? <div key={`s${i}`} style={{ width: 1, height: 22, background: '#D8D8D8', margin: '0 4px' }}></div>
              : <button key={item.label} className="toolbar-btn" title={item.title} onClick={item.action} disabled={item.disabled || false} style={{ ...item.style, background: 'none', border: 'none', padding: '6px 10px', cursor: 'pointer', borderRadius: 4 }}>{item.label}</button>
            )}
            <span style={{ marginLeft: 'auto', fontSize: 11, color: '#999', fontStyle: 'italic' }}>Pilih teks → format</span>
          </div>

          <div ref={bodyRef} contentEditable className="editor-body" data-placeholder="Mulai menulis isi berita… Klik 📷 di toolbar untuk menyisipkan foto setelah paragraf." onInput={updateWordCount} suppressContentEditableWarning
               style={{ minHeight: 300, outline: 'none', fontSize: 18, lineHeight: 1.8 }}></div>

          <div style={{ marginTop: 28, paddingTop: 16, borderTop: '1px solid #EBEBEB', display: 'flex', gap: 20, fontSize: 12, color: '#AAA', flexWrap: 'wrap', alignItems: 'center' }}>
            <span><strong style={{ color: '#666' }}>{wordCount}</strong> kata</span>
            <span><strong style={{ color: '#666' }}>{Math.max(1, Math.ceil(wordCount / 200))}</strong> menit baca</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>📷</span>
              <strong style={{ color: totalPhotos >= 2 ? '#1B6B3A' : '#666' }}>{totalPhotos}/2</strong>
              <span>foto diunggah</span>
            </span>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ background: '#fff', padding: '28px 22px', minHeight: 'calc(100vh - 54px)', position: 'sticky', top: 54 }}>
          <div className="sidebar-section" style={{ paddingBottom: 20, borderBottom: '1px solid #eee', marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#999', marginBottom: 12 }}>Kategori</div>
            {CATEGORIES.map(c => (
              <div key={c.slug} onClick={() => setCategory(c.slug)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', cursor: 'pointer', borderRadius: 4, background: category === c.slug ? '#F0FAF4' : 'transparent', marginBottom: 4 }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${category === c.slug ? c.color : '#D0D0D0'}`, background: category === c.slug ? c.color : 'transparent', transition: 'all .15s' }}></div>
                <span style={{ fontSize: 14, fontWeight: category === c.slug ? 700 : 400, color: category === c.slug ? c.color : '#444' }}>{c.label}</span>
              </div>
            ))}
          </div>

          <div className="sidebar-section" style={{ paddingBottom: 20, borderBottom: '1px solid #eee', marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#999', marginBottom: 12 }}>Penulis</div>
            <input placeholder="Nama lengkap" value={authorName} onChange={e => setAuthorName(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, marginBottom: 8, fontFamily: 'inherit' }} />
            <input placeholder="NIM Mahasiswa" value={authorNim} onChange={e => setAuthorNim(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, fontFamily: 'inherit' }} />
          </div>

          <div className="sidebar-section" style={{ paddingBottom: 20, borderBottom: '1px solid #eee', marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#999', marginBottom: 12 }}>Tags / Kata Kunci</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10, minHeight: 28 }}>
              {tags.map(t => <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#E8F4ED', color: '#1B6B3A', borderRadius: 4, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>{t}<button onClick={() => setTags(tags.filter(x => x !== t))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1B6B3A' }}>×</button></span>)}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input placeholder="Tambah tag…" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, fontFamily: 'inherit' }} />
              <button onClick={addTag} style={{ background: '#1B6B3A', color: '#fff', border: 'none', padding: '0 14px', borderRadius: 4, fontWeight: 700, cursor: 'pointer' }}>+</button>
            </div>
          </div>

          <button onClick={() => { if (window.confirm('Hapus draft ini?')) resetEditor(); }} style={{ width: '100%', background: 'none', border: '1px solid #E0E0E0', color: '#999', padding: '9px 16px', fontSize: 13, cursor: 'pointer', borderRadius: 4, marginTop: 20 }}>
            Hapus Draft
          </button>
        </div>
      </div>

      {/* MODALS */}
      {publishStep === 'check' && <CheckModal issues={checkIssues} onBack={() => setPublishStep(null)} onContinue={() => setPublishStep('terms')} score={geminiScore} summary={geminiSummary} loading={geminiLoading} onCheckGemini={handleGeminiCheck} />}
      {publishStep === 'terms' && <TermsModal onBack={() => setPublishStep('check')} onPublish={() => { saveDraft(); setPublishStep('success'); }} />}
      {publishStep === 'success' && <SuccessOverlay title={title} category={category} author={authorName} onHome={() => navigate('/')} onNew={resetEditor} />}
    </div>
  )
}
