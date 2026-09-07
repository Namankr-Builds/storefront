import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"
import { useCartStore } from "./store"
import { toast } from "sonner"

export function AddToCartControl({ product }) {
  const items = useCartStore((s) => s.items)
  const addItem = useCartStore((s) => s.addItem)
  const setQty = useCartStore((s) => s.setQty)

  const line = items.find((i) => i.productId === product.id)

  if (product.stock === 0) {
    return <Button className="w-full" disabled>Out of stock</Button>
  }

  if (!line) {
    return (
      <Button
        className="w-full"
        onClick={() => {
          addItem(product, 1)
          toast.success("Added to cart", { description: product.title })
        }}
      >
        Add to cart
      </Button>
    )
  }

  return (
    <div className="flex items-center border rounded-md w-fit">
      <Button
        size="icon"
        variant="ghost"
        className="h-9 w-9"
        onClick={() => setQty(product.id, line.qty - 1)}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-8 text-center" aria-live="polite">
        {line.qty}
      </span>
      <Button
        size="icon"
        variant="ghost"
        className="h-9 w-9"
        onClick={() => setQty(product.id, line.qty + 1)}
        disabled={line.qty >= product.stock}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}