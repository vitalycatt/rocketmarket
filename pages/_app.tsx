import type { AppProps } from 'next/app'
import '../app/globals.css';
import { LanguageProvider } from '@/lib/language-context'
import { CartProvider } from '@/lib/cart-context'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </LanguageProvider>
  )
}
