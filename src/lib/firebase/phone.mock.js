export function createMockPhoneAuth() {
  return {
    async start(phoneE164) {
      await new Promise((r) => setTimeout(r, 600)) // simulate network
      return {
        async confirm(code) {
          await new Promise((r) => setTimeout(r, 600))
          if (code !== "123456") {
            throw new Error("Invalid code. Try 123456 in this demo.")
          }
          return { phoneNumber: phoneE164 }
        },
      }
    },
  }
}