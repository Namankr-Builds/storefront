import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { useCartStore } from "./store"
import { CartDrawer } from "./CartDrawer"
import { motion, AnimatePresence } from "motion/react"

export function CartButton() {
  const [open, setOpen] = useState(false)
  const count = useCartStore((s) => s.count())

  return (
    <>
      <button onClick={() => setOpen(true)} className="relative p-2" aria-label="Open cart">
        <ShoppingCart className="h-5 w-5" />
        <AnimatePresence>
          {count > 0 && (
            <motion.span
              key={count}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
            >
              {count}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      <CartDrawer open={open} onOpenChange={setOpen} />
    </>
  )
}