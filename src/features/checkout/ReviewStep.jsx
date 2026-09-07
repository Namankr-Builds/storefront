import { Button } from "@/components/ui/button"
import { formatINR } from "@/lib/money"

export function ReviewStep({ form, items, onBack, onPlaceOrder, placing }) {
  const values = form.getValues()
  const total = items.reduce((sum, i) => sum + i.qty * i.priceInPaiseAtAdd, 0)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Shipping to</h3>
        <p className="text-sm text-muted-foreground">
          {values.fullName}, {values.addressLine1}, {values.city}, {values.state} {values.pincode}
        </p>
      </div>

      <div>
        <h3 className="font-medium mb-2">Items</h3>
        {items.map((item) => (
          <div key={item.productId} className="flex justify-between text-sm py-1">
            <span>{item.titleAtAdd} × {item.qty}</span>
            <span>{formatINR(item.qty * item.priceInPaiseAtAdd)}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between font-bold border-t pt-3">
        <span>Total</span>
        <span>{formatINR(total)}</span>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1" disabled={placing}>
          Back
        </Button>
        <Button onClick={onPlaceOrder} className="flex-1" disabled={placing}>
          {placing ? "Processing..." : `Pay ${formatINR(total)}`}
        </Button>
      </div>
    </div>
  )
}