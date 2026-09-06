import { createContext, useContext, useEffect, useRef, useState } from "react"
import { auth, onAuthStateChanged } from "@/lib/firebase/auth"
import { fetchRemoteCart, writeRemoteCart } from "@/lib/firebase/cartRepo"
import { mergeCarts } from "@/features/cart/mergeCarts"
import { useCartStore } from "@/features/cart/store"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [state, setState] = useState({ status: "loading" })
  const hasMerged = useRef(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (!hasMerged.current) {
          hasMerged.current = true
          const localItems = useCartStore.getState().items
          const remoteItems = await fetchRemoteCart(user.uid)
          const merged = mergeCarts(localItems, remoteItems)

          useCartStore.setState({ items: merged })
          await writeRemoteCart(user.uid, merged)
        }
        setState({ status: "authed", user })
      } else {
        hasMerged.current = false
        setState({ status: "anon" })
      }
    })
    return unsubscribe
  }, [])

  if (state.status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}