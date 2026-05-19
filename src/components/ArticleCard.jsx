import { ImagePlaceholder, CategoryBadge } from './ImagePlaceholder'

export function ArticleCardSmall({ article, onClick }) {
  return (
    <article onClick={() => onClick?.(article)} style={{ display: "flex", gap: 14, cursor: "pointer", paddingBottom: 18, borderBottom: "1px solid #E2E2E2", marginBottom: 18 }}>
      <div style={{ flex: "0 0 90px" }}><ImagePlaceholder desc={article.imageDesc} aspect="75%" /></div>
      <div style={{ flex: 1 }}>
        <CategoryBadge label={article.category} slug={article.categorySlug} />
        <h4 className="article-headline-hover" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "15px", lineHeight: 1.35, marginTop: 6, color: "#1A1A1A" }}>{article.title}</h4>
        <p style={{ fontSize: "12px", color: "#777", marginTop: 5 }}>{article.date}</p>
      </div>
    </article>
  )
}

export function ArticleCardMedium({ article, onClick }) {
  return (
    <article onClick={() => onClick?.(article)} className="card-hover" style={{ cursor: "pointer" }}>
      <ImagePlaceholder desc={article.imageDesc} aspect="62%" />
      <div style={{ padding: "16px 0 0" }}>
        <CategoryBadge label={article.category} slug={article.categorySlug} />
        <h3 className="article-headline-hover" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "18px", lineHeight: 1.35, marginTop: 8, color: "#1A1A1A" }}>{article.title}</h3>
        <p style={{ marginTop: 8, fontSize: "14px", color: "#5C5C5C", lineHeight: 1.6 }}>{article.excerpt}</p>
        <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center", fontSize: "12px", color: "#999" }}>
          <span>{article.author}</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#ccc", display: "inline-block" }}></span>
          <span>{article.date}</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#ccc", display: "inline-block" }}></span>
          <span>{article.readTime} baca</span>
        </div>
      </div>
    </article>
  )
}

export function ArticleCardLarge({ article, onClick }) {
  return (
    <article onClick={() => onClick?.(article)} className="card-hover" style={{ cursor: "pointer", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
      <ImagePlaceholder desc={article.imageDesc} aspect="65%" />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <CategoryBadge label={article.category} slug={article.categorySlug} size="lg" />
        <h3 className="article-headline-hover" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "22px", lineHeight: 1.3, marginTop: 12, color: "#1A1A1A" }}>{article.title}</h3>
        <p style={{ marginTop: 10, fontSize: "15px", color: "#5C5C5C", lineHeight: 1.65 }}>{article.excerpt}</p>
        <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center", fontSize: "13px", color: "#999" }}>
          <span style={{ fontWeight: 600, color: "#555" }}>{article.author}</span>
          <span>·</span><span>{article.date}</span>
          <span>·</span><span>{article.readTime} baca</span>
        </div>
      </div>
    </article>
  )
}
