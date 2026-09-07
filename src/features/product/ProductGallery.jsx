import { useState } from "react"
import { WishlistButton } from "../wishlist/WishlistButton"

export function ProductGallery({ images, title, productId }) {
  const [active, setActive] = useState(0)
  const safeImages = images.length > 0 ? images : ["/placeholder.png"]

  return (
    <div>
      <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100">
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton
            productId={productId}
            className="rounded-full bg-white p-2 shadow-md hover:bg-neutral-50"
          />
        </div>
        <img
          src={safeImages[active]}
          alt={title}
          width={600}
          height={600}
          onError={(e) => { e.currentTarget.src = "/placeholder.png" }}
          className="h-full w-full object-cover"
        />
      </div>

      {safeImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {safeImages.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`h-16 w-16 shrink-0 rounded-md overflow-hidden border-2 ${
                i === active ? "border-neutral-900" : "border-transparent"
              }`}
            >
              <img
                src={img}
                alt=""
                width={64}
                height={64}
                onError={(e) => { e.currentTarget.src = "/placeholder.png" }}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}