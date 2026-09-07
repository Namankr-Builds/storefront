import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { useProductFilters } from "./useProductFilters"

export function SearchInput() {
  const { q, setQ } = useProductFilters()
  const [local, setLocal] = useState(q)

  useEffect(() => {
    const timer = setTimeout(() => setQ(local || null), 300)
    return () => clearTimeout(timer)
  }, [local])

  return (
    <Input
      placeholder="Search products..."
      value={local}
      onChange={(e) => setLocal(e.target.value)}
    />
  )
}