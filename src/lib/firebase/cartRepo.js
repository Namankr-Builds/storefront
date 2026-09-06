import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "./firestore"

function cartRef(uid) {
  return doc(db, "users", uid, "cart", "current")
}

export async function fetchRemoteCart(uid) {
  const snap = await getDoc(cartRef(uid))
  return snap.exists() ? snap.data().items : []
}

export async function writeRemoteCart(uid, items) {
  await setDoc(cartRef(uid), { items, updatedAt: Date.now() })
}