import { useParams, Link } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { fetchProduct } from "@/lib/api/products"
import { keys } from "@/lib/query"
import { formatINR } from "@/lib/money"
import { ProductGallery } from "./ProductGallery"
import { Skeleton } from "@/components/ui/skeleton"
import { AddToCartControl } from "@/features/cart/AddToCartControl"

export function Component() {
  const { id } = useParams()

  const { data: product, isLoading, error } = useQuery({
    queryKey: keys.product(id),
    queryFn: () => fetchProduct(id),
  })

  if (isLoading) {
    return (
      <div className="p-6 grid md:grid-cols-2 gap-8">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-1/4" />
        </div>
      </div>
    )
  }

  if (error) return <div className="p-8">Couldn't load this product. {error.message}</div>
  if (!product) return <div className="p-8">Product not found.</div>

  return (
    <div className="p-6">
      <nav className="text-sm text-neutral-500 mb-6">
        <Link to="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span className="capitalize">{product.category}</span>
        <span className="mx-2">/</span>
        <span className="text-neutral-900">{product.title}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        <ProductGallery
          images={product.images}
          title={product.title}
          productId={product.id}
        />

        <div>
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {product.brand ?? product.category}
          </p>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold">
              {formatINR(product.finalPriceInPaise)}
            </span>
            {product.discountBps > 0 && (
              <span className="text-sm text-neutral-400 line-through">
                {formatINR(product.priceInPaise)}
              </span>
            )}
          </div>

          <p className="mt-4 text-sm text-neutral-600">{product.description}</p>

          <p className="mt-4 text-sm">
            {product.stock > 0
              ? `${product.stock} in stock`
              : <span className="text-red-600">Out of stock</span>}
          </p>
          
          <div className="mt-4">
            <AddToCartControl product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}