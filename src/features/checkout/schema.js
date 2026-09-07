import { z } from "zod"

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  phone: z.string().min(10, "Enter a valid phone number"),
  addressLine1: z.string().min(5, "Enter your address"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "Enter your city"),
  state: z.string().min(2, "Enter your state"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  cardName: z.string().min(2, "Enter the name on card"),
})

export const stepFields = {
  address: ["fullName", "phone", "addressLine1", "addressLine2", "city", "state", "pincode"],
  payment: ["cardName"],
  review: [],
}