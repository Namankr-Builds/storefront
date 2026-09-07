import { useState } from "react"
import { useParams, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { checkoutSchema, stepFields } from "./schema"
import { AddressStep } from "./AddressStep"
import { PaymentStep } from "./PaymentStep"
import { ReviewStep } from "./ReviewStep"
import { useCartStore } from "@/features/cart/store"
import { placeOrder } from "@/lib/firebase/ordersRepo"
import { useAuth } from "@/features/auth/AuthProvider"
import { toast } from "sonner"

const STEPS = ["address", "payment", "review"]

export function Component() {
  const { step } = useParams()
  const navigate = useNavigate()
  const auth = useAuth()
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clear)
  const [placing, setPlacing] = useState(false)

  const form = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "", phone: "", addressLine1: "", addressLine2: "",
      city: "", state: "", pincode: "", cardName: "",
    },
  })

  const currentIndex = STEPS.indexOf(step)

  const goNext = async () => {
    const valid = await form.trigger(stepFields[step])
    if (!valid) return
    if (currentIndex < STEPS.length - 1) {
      navigate(`/checkout/${STEPS[currentIndex + 1]}`)
    }
  }

  const goBack = () => {
    if (currentIndex > 0) navigate(`/checkout/${STEPS[currentIndex - 1]}`)
  }

  const handlePlaceOrder = async () => {
    setPlacing(true)
    try {
      const orderId = await placeOrder(auth.user.uid, items, form.getValues())
      clearCart()
      navigate(`/orders?justPlaced=${orderId}`)
      toast.success("Order placed", { description: orderId })
    } catch (err) {
      toast.error("Order failed", { description: "Please try again." })
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="flex gap-4 mb-6 text-sm">
        {STEPS.map((s, i) => (
          <span key={s} className={i === currentIndex ? "font-bold" : "text-muted-foreground"}>
            {i + 1}. {s}
          </span>
        ))}
      </div>

      {step === "address" && <AddressStep form={form} onNext={goNext} />}
      {step === "payment" && (
        <PaymentStep form={form} onNext={goNext} onBack={goBack} />
      )}
      {step === "review" && (
        <ReviewStep
          form={form}
          items={items}
          onBack={goBack}
          onPlaceOrder={handlePlaceOrder}
          placing={placing}
        />
      )}
    </div>
  )
}