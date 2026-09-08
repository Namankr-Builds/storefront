import { toPaise, applyDiscount } from "@/lib/money"

const BASE = "https://dummyjson.com"

async function apiFetch(url, options = {}) {
  console.log("[API request body]", options.body ?? null)
  return fetch(url, options)
}

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

/** @returns {Product} */
function toDomain(raw) {
  const priceInPaise = toPaise(raw.price)
  const discountBps = Math.round((raw.discountPercentage ?? 0) * 100)
  return {
    id: String(raw.id),
    slug: slugify(raw.title),
    title: raw.title,
    brand: raw.brand, // may be undefined, and that's fine
    category: raw.category,
    description: raw.description,
    priceInPaise,
    discountBps,
    finalPriceInPaise: applyDiscount(priceInPaise, discountBps),
    rating: raw.rating,
    stock: raw.stock,
    images: raw.images ?? [],
    thumbnail: raw.thumbnail,
  }
}

export async function fetchAllProducts() {
  const res = await apiFetch(`${BASE}/products?limit=0`)
  if (!res.ok) throw new Error(`Products fetch failed: ${res.status}`)
  const json = await res.json()
  return json.products.map(toDomain)
}

export async function fetchProduct(id) {
  const res = await apiFetch(`${BASE}/products/${id}`)
  if (!res.ok) throw new Error(`Product fetch failed: ${res.status}`)
  const raw = await res.json()
  return toDomain(raw)
}