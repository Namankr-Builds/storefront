import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function AddressStep({ form, onNext }) {
  const { register, formState: { errors } } = form

  return (
    <div className="space-y-4">
      <div>
        <Input placeholder="Full name" {...register("fullName")} />
        {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
      </div>
      <div>
        <Input placeholder="Phone number" {...register("phone")} />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
      </div>
      <div>
        <Input placeholder="Address line 1" {...register("addressLine1")} />
        {errors.addressLine1 && <p className="text-sm text-destructive">{errors.addressLine1.message}</p>}
      </div>
      <Input placeholder="Address line 2 (optional)" {...register("addressLine2")} />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input placeholder="City" {...register("city")} />
          {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
        </div>
        <div>
          <Input placeholder="State" {...register("state")} />
          {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
        </div>
      </div>
      <div>
        <Input placeholder="Pincode" {...register("pincode")} />
        {errors.pincode && <p className="text-sm text-destructive">{errors.pincode.message}</p>}
      </div>

      <Button onClick={onNext} className="w-full">Continue to payment</Button>
    </div>
  )
}