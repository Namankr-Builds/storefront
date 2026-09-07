import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function PaymentStep({ form, onNext, onBack }) {
  const { register, formState: { errors } } = form

  return (
    <div className="space-y-4">
      <div>
        <Input placeholder="Name on card" {...register("cardName")} />
        {errors.cardName && <p className="text-sm text-destructive">{errors.cardName.message}</p>}
      </div>
      {/* Deliberately fake — no real card number/CVV fields.
          Real payment collection needs PCI scope this project doesn't take on. */}
      <Input placeholder="Card number" disabled value="4242 4242 4242 4242" />
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="MM/YY" disabled value="12/29" />
        <Input placeholder="CVV" disabled value="123" />
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} className="flex-1">Review order</Button>
      </div>
    </div>
  )
}