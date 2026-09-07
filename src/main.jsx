import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { Providers } from './app/providers'
import { router } from './app/router'
import './index.css'
import { AuthProvider } from "./features/auth/AuthProvider"
import { NuqsAdapter } from "nuqs/adapters/react-router/v7"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Providers>
      <AuthProvider>
        <NuqsAdapter>
         <RouterProvider router={router} />
        </NuqsAdapter>
      </AuthProvider>
    </Providers>
  </StrictMode>
)
