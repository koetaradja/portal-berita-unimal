/**
 * Gemini Flash API — Pengecekan tulisan (typo, tata bahasa, ejaan)
 * Menggunakan Gemini 2.0 Flash via REST API
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

/**
 * Mengecek tulisan menggunakan Gemini Flash
 * @param {string} title - Judul berita
 * @param {string} subtitle - Teras/ringkasan berita
 * @param {string} body - Isi berita
 * @returns {Promise<Object>} Hasil pengecekan
 */
export async function checkArticleWithGemini(title, subtitle, body) {
  const prompt = `Anda adalah editor berita profesional untuk Portal Berita Ilmu Komunikasi Universitas Malikussaleh.

Periksa tulisan berita berikut dan berikan koreksi dalam format JSON yang valid.

JUDUL: ${title}
RINGKASAN: ${subtitle}
ISI BERITA:
${body}

Tugas Anda:
1. Temukan SEMUA kesalahan ejaan (typo) dalam bahasa Indonesia
2. Temukan kesalahan tata bahasa (grammar) 
3. Temukan penggunaan kata yang tidak baku atau tidak sesuai KBBI/EYD
4. Periksa konsistensi penulisan angka, tanggal, dan nama
5. Berikan skor kualitas tulisan (0-100)
6. Berikan ringkasan singkat kualitas keseluruhan

Balas HANYA dalam format JSON berikut (tanpa markdown code block):
{
  "score": 85,
  "summary": "Ringkasan kualitas tulisan",
  "issues": [
    {
      "type": "typo | grammar | word_choice | consistency",
      "severity": "error | warning | info",
      "original": "kata/kalimat yang salah",
      "suggestion": "kata/kalimat yang benar",
      "explanation": "penjelasan singkat",
      "location": "title | subtitle | body"
    }
  ],
  "improved_title": "judul yang sudah diperbaiki (jika ada koreksi)",
  "improved_subtitle": "ringkasan yang sudah diperbaiki (jika ada koreksi)"
}`

  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 4096,
        }
      })
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      throw new Error(errData?.error?.message || `Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    // Parse JSON dari response (handle jika ada markdown code block)
    const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(jsonStr)
  } catch (err) {
    console.error('Gemini check error:', err)
    throw err
  }
}
