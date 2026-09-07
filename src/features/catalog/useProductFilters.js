import {
  useQueryState,
  parseAsString,
  parseAsInteger,
  parseAsStringLiteral,
} from "nuqs"

const SORTS = ["featured", "price_asc", "price_desc", "rating_desc"]

export function useProductFilters() {
  const [q, setQ] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ history: "replace" })
  )
  const [category, setCategory] = useQueryState(
    "category",
    parseAsString.withDefault("").withOptions({ history: "replace" })
  )
  const [min, setMin] = useQueryState(
    "min",
    parseAsInteger.withDefault(0).withOptions({ history: "replace" })
  )
  const [max, setMax] = useQueryState(
    "max",
    parseAsInteger.withDefault(0).withOptions({ history: "replace" }) // 0 = no cap
  )
  const [rating, setRating] = useQueryState(
    "rating",
    parseAsInteger.withDefault(0).withOptions({ history: "replace" })
  )
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsStringLiteral(SORTS).withDefault("featured").withOptions({ history: "replace" })
  )
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1) // no history: 'replace' — page changes SHOULD push
  )

  return {
    q, setQ,
    category, setCategory,
    min, setMin,
    max, setMax,
    rating, setRating,
    sort, setSort,
    page, setPage,
  }
}