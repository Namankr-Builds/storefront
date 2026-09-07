import { useSearchParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { fetchOrders } from "@/lib/firebase/ordersRepo"
import { useAuth } from "@/features/auth/AuthProvider"
import { formatINR } from "@/lib/money"

export function Component() {
  const auth = useAuth()
  const [searchParams] = useSearchParams()
  const justPlaced = searchParams.get("justPlaced")

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["orders", auth.user?.uid],
    queryFn: () => fetchOrders(auth.user.uid),
    enabled: auth.status === "authed",
  })

  if (isLoading) return <div className="p-8">Loading orders...</div>
  if (error) return <div className="p-8">Error: {error.message}</div>

  if (!orders || orders.length === 0) {
    return (
      <div className="p-8 text-center py-16">
        <p className="text-muted-foreground">No orders yet.</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-xl font-medium mb-6">Your Orders</h1>

      {justPlaced && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-6">
          Order {justPlaced} placed successfully.
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.orderId} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-medium">{order.orderId}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              </div>
              <span className="text-sm px-2 py-1 rounded bg-muted capitalize">
                {order.status}
              </span>
            </div>

            <div className="space-y-1 mb-3">
              {order.lines.map((line) => (
                <div key={line.productId} className="flex justify-between text-sm">
                  <span>{line.title} × {line.qty}</span>
                  <span>{formatINR(line.qty * line.priceInPaiseAtPurchase)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-medium border-t pt-2">
              <span>Total</span>
              <span>{formatINR(order.totalInPaise)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}