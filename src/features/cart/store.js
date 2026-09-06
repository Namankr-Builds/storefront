import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { writeRemoteCart } from "@/lib/firebase/cartRepo"
import { auth } from "@/lib/firebase/auth"

let writeTimer = null


function scheduleRemoteWrite(items) {
  const user = auth.currentUser
  if (!user) return // anonymous — localStorage only, nothing to sync

  clearTimeout(writeTimer)
  writeTimer = setTimeout(() => {
    writeRemoteCart(user.uid, items)
  }, 400)
}

// flush immediately if the tab is being backgrounded mid-debounce
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && writeTimer) {
      clearTimeout(writeTimer)
      const user = auth.currentUser
      const items = useCartStore.getState().items
      if (user) writeRemoteCart(user.uid, items)
    }
  })
}

const CART_VERSION = 1


export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, qty = 1) => {
        const { items } = get()
        const existing = items.find((i) => i.productId === product.id)
        let nextItems

        if (existing) {
          const nextQty = Math.min(existing.qty + qty, product.stock)
          nextItems = items.map((i) =>
            i.productId === product.id ? { ...i, qty: nextQty } : i
          )
        } else {
          nextItems = [
            ...items,
            {
              productId: product.id,
              qty: Math.min(qty, product.stock),
              priceInPaiseAtAdd: product.finalPriceInPaise,
              titleAtAdd: product.title,
              image: product.thumbnail,
              stock: product.stock,
            },
          ]
        }

        set({ items: nextItems })
        scheduleRemoteWrite(nextItems)
      },

      setQty: (productId, qty) => {
        const { items } = get()
        const item = items.find((i) => i.productId === productId)
        if (!item) return

        const clamped = Math.max(0, Math.min(qty, item.stock))
        const nextItems =
          clamped === 0
            ? items.filter((i) => i.productId !== productId)
            : items.map((i) =>
                i.productId === productId ? { ...i, qty: clamped } : i
              )

        set({ items: nextItems })
        scheduleRemoteWrite(nextItems) // ← new
      },

      removeItem: (productId) => {
        const nextItems = get().items.filter((i) => i.productId !== productId)
        set({ items: nextItems })
        scheduleRemoteWrite(nextItems) // ← new
      },

      clear: () => {
        set({ items: [] })
        scheduleRemoteWrite([]) // ← new
      },

      count: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      totalInPaise: () =>
        get().items.reduce((sum, i) => sum + i.qty * i.priceInPaiseAtAdd, 0),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      version: CART_VERSION,
      migrate: (persisted, version) => {
        if (version < CART_VERSION) {
          return { items: [] } // wipe on shape change rather than crash
        }
        return persisted
      },
    }
  )
)