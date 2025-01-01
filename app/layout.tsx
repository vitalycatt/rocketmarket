import '@/app/globals.css'
import { LanguageProvider } from '@/lib/language-context'
import { CartProvider } from '@/lib/cart-context'
import { AddressProvider } from '@/lib/address-context'
import { AuthProvider } from '@/lib/auth-context'
import { Preloader } from '@/components/preloader'
import { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Rocket Market',
  description: 'Your one-stop shop for all your needs',
  manifest: '/manifest.json',
  icons: {
    apple: '/icons/icon-192x192.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#f3f4f6',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="Rocket Market" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Rocket Market" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#f3f4f6" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <LanguageProvider>
          <CartProvider>
            <AddressProvider>
              <AuthProvider>
                <Preloader />
                <Toaster position="top-right" />
                {children}
              </AuthProvider>
            </AddressProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
