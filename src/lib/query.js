import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
})

export const keys = {
  products: ["products"],
  product: (id) => ["products", id],
  cart: (uid) => ["cart", uid],
}