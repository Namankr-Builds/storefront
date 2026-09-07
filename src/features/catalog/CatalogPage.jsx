import { useQuery } from "@tanstack/react-query"
import { fetchAllProducts } from "@/lib/api/products"
import { keys } from "@/lib/query"
import { useProductFilters } from "./useProductFilters"
import { filterProducts } from "./filterProducts"
import { SearchInput } from "./SearchInput"
import { ProductCard } from "./ProductCard"

const PAGE_SIZE = 24

export function Component() {
  const { data, isLoading, error } = useQuery({
    queryKey: keys.products,
    queryFn: fetchAllProducts,
  })
  const filters = useProductFilters()

  if (isLoading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8">Error: {error.message}</div>

  const filtered = filterProducts(data, filters)
  const start = (filters.page - 1) * PAGE_SIZE
  const paged = filtered.slice(start, start + PAGE_SIZE)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  return (
    <div className="p-8">
      <SearchInput />

      {/* category/sort/rating controls go here — wire to filters.setCategory etc. */}

      {paged.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">No products match these filters.</p>
          <button
            onClick={() => {
              filters.setQ(null)
              filters.setCategory(null)
              filters.setMin(null)
              filters.setMax(null)
              filters.setRating(null)
            }}
            className="underline text-sm"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {paged.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => filters.setPage(p)}
              className={p === filters.page ? "font-bold" : ""}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}