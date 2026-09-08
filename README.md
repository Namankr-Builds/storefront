# StoreFront

Live demo: (https://storefront-eight-topaz.vercel.app/)

## Stack
- Vite + React (JS) — client-side only, chosen over Next.js since every feature here is client-side state (cart, filters, auth)
- TanStack Query — server state, caching
- Zustand — cart state with localStorage persistence
- Firebase Auth (Google) + Firestore — auth and per-user data
- nuqs — filters as URL state
- React Hook Form + Zod — checkout form
- Tailwind v4 + shadcn/ui — UI, Radix primitives for accessibility
- DummyJSON — product data (~194 items, fetched once)

## Architecture decisions
[Pull 4-5 of the most interesting ones from this whole build — the money-as-integers decision, the cart merge max-not-sum logic, the adapter boundary in lib/api, the mocked OTP interface]

## Known limitations
- Filtering is client-side over the full 194-product set; doesn't scale past a few thousand products — production would need server-side filtering or a search index (Algolia/Typesense)
- Phone/SMS verification is mocked behind a `PhoneAuth` interface to avoid Firebase's per-message billing (demo code: `123456`) — swap in `phone.real.js` to go live
- Payment is simulated; no real Stripe/Razorpay integration — would require a backend to create orders and verify signatures server-side

## What I'd do next
- Migrate to Next.js for SSR/SEO
- Real payment via hosted checkout
- Server-side search index