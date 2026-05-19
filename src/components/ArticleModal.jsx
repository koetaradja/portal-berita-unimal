import { ImagePlaceholder, CategoryBadge } from './ImagePlaceholder'

export default function ArticleModal({ article, onClose }) {
  if (!article) return null
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, overflowY: "auto" }} onClick={onClose}>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}></div>
      <div onClick={e => e.stopPropagation()} style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "40px auto 80px", background: "#fff", padding: "0 0 40px" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "#1A1A1A", color: "#fff", border: "none", width: 36, height: 36, cursor: "pointer", fontSize: "18px", lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>×</button>
        <ImagePlaceholder desc={article.imageDesc} aspect="50%" />
        <div style={{ padding: "28px 40px 0" }}>
          <CategoryBadge label={article.category} slug={article.categorySlug} size="lg" />
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "30px", lineHeight: 1.25, marginTop: 16, color: "#1A1A1A" }}>{article.title}</h1>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 14, paddingBottom: 18, borderBottom: "1px solid #E2E2E2", fontSize: "13px", color: "#777" }}>
            <span style={{ fontWeight: 600, color: "#444" }}>{article.author}</span>
            <span>·</span><span>{article.date}</span>
            <span>·</span><span>{article.readTime} membaca</span>
          </div>
          <p style={{ marginTop: 22, fontSize: "17px", color: "#1A1A1A", lineHeight: 1.75 }}>{article.excerpt}</p>
          {article.body ? (
            <div 
              style={{ marginTop: 18, fontSize: "17px", color: "#333", lineHeight: 1.75, wordBreak: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: article.body }}
            />
          ) : (
            <>
              <p style={{ marginTop: 18, fontSize: "17px", color: "#333", lineHeight: 1.75 }}>
                Universitas Malikussaleh terus berkomitmen untuk meningkatkan standar akademik di Prodi Ilmu Komunikasi. Program ini telah menghasilkan ratusan lulusan yang kini berkarier di berbagai bidang media, hubungan masyarakat, dan komunikasi korporat di seluruh Indonesia.
              </p>
              <p style={{ marginTop: 18, fontSize: "17px", color: "#333", lineHeight: 1.75 }}>
                Dengan fasilitas laboratorium multimedia modern, studio radio, dan studio produksi video, mahasiswa mendapatkan pengalaman praktis yang tak ternilai sebelum memasuki dunia kerja yang kompetitif.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
