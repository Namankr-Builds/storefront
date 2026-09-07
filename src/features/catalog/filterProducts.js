export function filterProducts(products, filters) {
  let result = products

  if (filters.q) {
    const q = filters.q.toLowerCase()
    result = result.filter((p) => p.title.toLowerCase().includes(q))
  }

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category)
  }

  if (filters.min > 0) {
    result = result.filter((p) => p.finalPriceInPaise >= filters.min * 100)
  }

  if (filters.max > 0) {
    result = result.filter((p) => p.finalPriceInPaise <= filters.max * 100)
  }

  if (filters.rating > 0) {
    result = result.filter((p) => p.rating >= filters.rating)
  }

  switch (filters.sort) {
    case "price_asc":
      result = [...result].sort((a, b) => a.finalPriceInPaise - b.finalPriceInPaise)
      break
    case "price_desc":
      result = [...result].sort((a, b) => b.finalPriceInPaise - a.finalPriceInPaise)
      break
    case "rating_desc":
      result = [...result].sort((a, b) => b.rating - a.rating)
      break
    // "featured" — no sort, keep original DummyJSON order
  }

  return result
}