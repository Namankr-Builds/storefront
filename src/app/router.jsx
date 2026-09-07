import { createBrowserRouter } from "react-router"
import RootLayout from "./RootLayout"
import RouteError from "./RouteError"
import NotFound from "./NotFound"
import { RequireAuth } from "@/features/auth/RequireAuth"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, lazy: () => import("@/features/catalog/CatalogPage") },
      { path: "product/:id", lazy: () => import("@/features/product/ProductPage") },
      {
        path: "checkout/:step",
        lazy: async () => {
          const { Component : CheckoutPage } = await import("@/features/checkout/CheckoutPage")
          return {
            Component: () => (
              <RequireAuth>
                <CheckoutPage />
              </RequireAuth>
            ),
          }
        },
      },
      { path: "orders", lazy: () => import("@/features/orders/OrdersPage") },
      { path: "login", lazy: () => import("@/features/auth/LoginPage") },
      { path: "product/:id/:slug?", lazy: () => import("@/features/product/ProductPage") },
      { path: "*", element: <NotFound /> },
    ],
  },
])