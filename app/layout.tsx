import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Empritlicious — Oleh-oleh Jogja',
  description: 'Kenangan kecil yang lahir dan besar di Jogja — dibuat tangan, dititipkan rasa.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="font-sans bg-cream text-brown-900 min-h-screen flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1 max-w-6xl w-full mx-auto">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
