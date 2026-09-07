import { useLocation, useNavigate } from "react-router"
import { useEffect } from "react"
import { GoogleSignInButton } from "./GoogleSignInButton"
import { useAuth } from "./AuthProvider"
import { PhoneOtpFlow } from "./PhoneOtpFlow"

export function Component() {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"

  useEffect(() => {
    if (auth.status === "authed") {
      navigate(from, { replace: true })
    }
  }, [auth.status])

  return (
    <><div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <h1 className="text-xl font-medium">Sign in to continue</h1>
          <p className="text-sm text-muted-foreground">
              You'll be returned to where you were.
          </p>
          <GoogleSignInButton />
      </div>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <h1 className="text-xl font-medium">Sign in to continue</h1>
          <p className="text-sm text-muted-foreground">
              You'll be returned to where you were.
          </p>
          <PhoneOtpFlow />
      </div>
    </>
  )
}