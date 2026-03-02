import { NextResponse } from "next/server"

/* Curated: green grass / fresh field — same hero on prod when UNSPLASH_ACCESS_KEY is not set */
const FALLBACK_URL = "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&h=1080&fit=crop&q=90"
const FALLBACK_ALT = "Green grass field"

const QUERIES = [
  "wheat field golden hour sunset",
  "grain harvest golden hour",
  "wheat field harvest",
  "farm grain sunset",
  "agriculture wheat field",
]

export async function GET() {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey) {
    return NextResponse.json({ url: FALLBACK_URL, alt: FALLBACK_ALT })
  }

  try {
    const idx = Math.floor(Date.now() / 86400000) % QUERIES.length
    const query: string = QUERIES[idx] ?? QUERIES[0] ?? "wheat field golden hour"
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${accessKey}&orientation=landscape&per_page=12`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) throw new Error("Unsplash API error")
    const data = await res.json()
    const results = data?.results || []
    if (results.length === 0) throw new Error("No results")
    const pick = results[Math.floor(Math.random() * Math.min(results.length, 5))]
    const url = pick?.urls?.regular || pick?.urls?.full || FALLBACK_URL
    const alt = pick?.alt_description || pick?.description || FALLBACK_ALT
    return NextResponse.json({ url, alt: alt.slice(0, 120) })
  } catch {
    return NextResponse.json({ url: FALLBACK_URL, alt: FALLBACK_ALT })
  }
}
