/**
 * Merges a local (anonymous) cart with a remote (signed-in) cart.
 * qty = max(local, remote), never sum — see README for why.
 */
export function mergeCarts(localItems, remoteItems) {
  const merged = new Map()

  for (const item of remoteItems) {
    merged.set(item.productId, { ...item })
  }

  for (const item of localItems) {
    const existing = merged.get(item.productId)
    if (existing) {
      merged.set(item.productId, {
        ...existing,
        qty: Math.max(existing.qty, item.qty),
      })
    } else {
      merged.set(item.productId, { ...item })
    }
  }

  return Array.from(merged.values())
}