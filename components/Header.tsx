'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

export default function Header() {
  const { totalQty } = useCart()

  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-border bg-cream sticky top-0 z-50">
      <Link href="/" className="font-display font-bold text-xl text-brown-800">
        Emprit<span className="text-amber">licious</span>
      </Link>

      <nav className="hidden md:flex gap-7 text-sm font-medium text-brown-700">
        <Link href="/">Beranda</Link>
        <Link href="/#katalog">Katalog</Link>
      </nav>

      <Link
        href="/keranjang"
        className="relative bg-brown-800 text-cream rounded-lg px-4 py-2 text-sm font-semibold flex items-center gap-2"
      >
        🧺 Keranjang
        {totalQty > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-danger text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {totalQty}
          </span>
        )}
      </Link>
    </header>
  )
}
