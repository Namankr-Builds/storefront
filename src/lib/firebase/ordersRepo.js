import { doc, 
runTransaction, 
collection, 
getDocs, 
orderBy, 
query } from "firebase/firestore"
import { nanoid } from "nanoid"
import { db } from "./firestore"

export async function fetchOrders(uid) {
  const q = query(
    collection(db, "users", uid, "orders"),
    orderBy("createdAt", "desc")
  )
  const snap = await getDocs(q)
  return snap.docs.map((doc) => doc.data())
}

export async function placeOrder(uid, cartItems, shippingDetails) {
  const orderId = `ORD-${new Date().getFullYear()}-${nanoid(6).toUpperCase()}`

  await new Promise((resolve) => setTimeout(resolve, 1500)) // simulate payment processing

  await runTransaction(db, async (transaction) => {
    const orderRef = doc(db, "users", uid, "orders", orderId)

    const lines = cartItems.map((item) => ({
      productId: item.productId,
      title: item.titleAtAdd,
      qty: item.qty,
      priceInPaiseAtPurchase: item.priceInPaiseAtAdd, // frozen, not live
      image: item.image,
    }))

    const total = lines.reduce((sum, l) => sum + l.qty * l.priceInPaiseAtPurchase, 0)

    transaction.set(orderRef, {
      orderId,
      status: "confirmed",
      shippingDetails,
      lines,
      totalInPaise: total,
      createdAt: Date.now(),
    })

    const cartRef = doc(db, "users", uid, "cart", "current")
    transaction.set(cartRef, { items: [], updatedAt: Date.now() })
  })

  return orderId
}