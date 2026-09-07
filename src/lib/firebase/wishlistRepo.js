import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "./firestore"

function wishlistRef(uid) {
  return doc(db, "users", uid, "wishlist", "current")
}

export async function fetchWishlist(uid) {
  const snap = await getDoc(wishlistRef(uid))
  return snap.exists() ? snap.data().productIds : []
}

export async function toggleWishlistItem(uid, productId, currentIds) {
  const next = currentIds.includes(productId)
    ? currentIds.filter((id) => id !== productId)
    : [...currentIds, productId]
  await setDoc(wishlistRef(uid), { productIds: next })
  return next
}