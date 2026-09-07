import { Heart } from "lucide-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/features/auth/AuthProvider"
import { fetchWishlist, toggleWishlistItem } from "@/lib/firebase/wishlistRepo"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function WishlistButton({ productId, className }) {
  const auth = useAuth()
  const queryClient = useQueryClient()

  const { data: productIds = [] } = useQuery({
    queryKey: ["wishlist", auth.user?.uid],
    queryFn: () => fetchWishlist(auth.user.uid),
    enabled: auth.status === "authed",
  })

  const isWishlisted = productIds.includes(productId)

  const handleToggle = async (e) => {
    e.stopPropagation() // don't trigger card click-through when this sits on a product card
    if (auth.status !== "authed") {
      toast.error("Sign in to save items")
      return
    }
    const next = await toggleWishlistItem(auth.user.uid, productId, productIds)
    queryClient.setQueryData(["wishlist", auth.user.uid], next)
  }

  return (
    <button
      onClick={handleToggle}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(className)}
    >
      <Heart
        className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
      />
    </button>
  )
}