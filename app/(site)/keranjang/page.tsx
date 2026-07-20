'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { formatRupiah } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="px-8 py-20 text-center">
        <div className="text-5xl mb-4">🧺</div>
        <h1 className="font-display font-bold text-2xl text-brown-800 mb-2">Keranjang kamu kosong</h1>
        <p className="text-brown-500 mb-6">Yuk pilih oleh-oleh favoritmu dulu.</p>
        <Link href="/#katalog" className="inline-block bg-brown-800 text-cream rounded-lg px-6 py-3 text-sm font-semibold">
          Lihat Katalog
        </Link>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-[1.6fr_1fr] gap-8 px-8 py-9">
      <div>
        <h1 className="font-display font-bold text-2xl text-brown-800 mb-5">
          Keranjang Kamu ({items.length} item)
        </h1>

        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variantName}`}
            className="flex gap-3.5 bg-card border border-border rounded-xl p-3.5 mb-3.5 items-center"
          >
            <div className="w-[70px] h-[70px] rounded-lg bg-cream-dark flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                '🍪'
              )}
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm text-brown-800">{item.name}</div>
              {item.variantName && (
                <div className="text-xs text-brown-300 mt-0.5">Varian: {item.variantName}</div>
              )}
              <button
                onClick={() => removeItem(item.productId, item.variantName)}
                className="text-xs text-danger mt-1.5"
              >
                🗑 Hapus
              </button>
            </div>
            <div className="text-right">
              <div className="font-bold text-brown-800 mb-2">{formatRupiah(item.price * item.qty)}</div>
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => updateQty(item.productId, item.variantName, item.qty - 1)}
                  className="w-8 h-8 bg-cream-dark"
                >
                  –
                </button>
                <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                <button
                  onClick={() => updateQty(item.productId, item.variantName, item.qty + 1)}
                  className="w-8 h-8 bg-cream-dark"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}

        <Link href="/#katalog" className="inline-block border-[1.5px] border-brown-800 text-brown-800 rounded-lg px-6 py-3 text-sm font-semibold">
          ← Lanjut Belanja
        </Link>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 h-fit sticky top-24">
        <h2 className="font-display font-bold text-lg text-brown-800 mb-4">Ringkasan Pesanan</h2>
        <div className="flex justify-between text-sm text-brown-700 mb-3">
          <span>Subtotal</span>
          <span>{formatRupiah(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-brown-700 mb-3">
          <span>Ongkos Kirim</span>
          <span>Dihitung di checkout</span>
        </div>
        <div className="flex justify-between font-bold text-brown-800 text-base border-t border-border pt-3 mt-1.5">
          <span>Total</span>
          <span>{formatRupiah(subtotal)}</span>
        </div>
        <Link
          href="/checkout"
          className="block text-center bg-brown-800 text-cream rounded-lg py-3.5 text-sm font-semibold mt-4"
        >
          Lanjut ke Checkout →
        </Link>
      </div>
    </div>
  )
}
