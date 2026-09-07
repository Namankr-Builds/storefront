import { useState, useRef } from "react"
import { parsePhoneNumberFromString } from "libphonenumber-js"
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createMockPhoneAuth } from "@/lib/firebase/phone.mock"

const phoneAuth = createMockPhoneAuth()
const RESEND_SECONDS = 30

export function PhoneOtpFlow() {
  const [stage, setStage] = useState("phone") // phone | otp
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const [otp, setOtp] = useState("")
  const [resendIn, setResendIn] = useState(0)
  const [verifying, setVerifying] = useState(false)
  const confirmRef = useRef(null)
  const timerRef = useRef(null)

  const startResendTimer = () => {
    setResendIn(RESEND_SECONDS)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setResendIn((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return s - 1
      })
    }, 1000)
  }

  const handleSendCode = async () => {
    const parsed = parsePhoneNumberFromString(phone, "IN")
    if (!parsed || !parsed.isValid()) {
      setError("Enter a valid phone number")
      return
    }
    setError("")
    confirmRef.current = await phoneAuth.start(parsed.number)
    setStage("otp")
    startResendTimer()
  }

  const handleVerify = async (code) => {
    setVerifying(true)
    setError("")
    try {
      await confirmRef.current.confirm(code)
      setStage("done")
    } catch (err) {
      setError(err.message)
      setOtp("")
    } finally {
      setVerifying(false)
    }
  }

  if (stage === "done") {
    return <p className="text-sm text-green-700">Phone verified ✓</p>
  }

  if (stage === "phone") {
    return (
      <div className="space-y-3">
        <Input
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button onClick={handleSendCode} className="w-full">
          Send code
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter the 6-digit code sent to {phone}
      </p>

      <OTPInput
        value={otp}
        onChange={setOtp}
        onComplete={handleVerify}
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS}
        containerClassName="flex gap-2"
        render={({ slots }) => (
          <>
            {slots.map((slot, i) => (
              <div
                key={i}
                className={`h-12 w-10 border rounded-md flex items-center justify-center text-lg ${
                  slot.isActive ? "border-black" : ""
                } ${error ? "border-destructive animate-shake" : ""}`}
              >
                {slot.char}
              </div>
            ))}
          </>
        )}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
      {verifying && <p className="text-sm text-muted-foreground">Verifying...</p>}

      <div className="flex justify-between text-sm">
        <button
          onClick={() => { setStage("phone"); setOtp(""); setError("") }}
          className="underline"
        >
          Change number
        </button>
        <button
          onClick={handleSendCode}
          disabled={resendIn > 0}
          className={resendIn > 0 ? "text-muted-foreground" : "underline"}
        >
          {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
        </button>
      </div>
    </div>
  )
}