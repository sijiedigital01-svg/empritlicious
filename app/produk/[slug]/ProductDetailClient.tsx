'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { formatRupiah } from '@/lib/utils'
import type { Product, ProductVariant } from '@/types/database'

export default function ProductDetailClient({
  product,
  variants,
}: {
  product: Product
  variants: ProductVariant[]
}) {
  const { addItem } = useCart()
  const router = useRouter()
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(variants[0] ?? null)
  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  const outOfStock = product.stock <= 0

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price + (selectedVariant?.extra_price ?? 0),
        imageUrl: product.image_url,
        variantName: selectedVariant?.name ?? null,
      },
      qty
    )
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1800)
  }

  function handleBuyNow() {
    handleAdd()
    router.push('/keranjang')
  }

  return (
    <div className="grid md:grid-cols-2 gap-12 px-8 py-10">
      <div>
        <div className="bg-card border border-border rounded-2xl h-96 flex items-center justify-center text-8xl">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            '🍪'
          )}
        </div>
      </div>

      <div>
        <h1 className="font-display font-bold text-3xl text-brown-800 mb-1.5">{product.name}</h1>
        {product.quote && (
          <p className="font-display italic text-amber mb-4">&ldquo;{product.quote}&rdquo;</p>
        )}
        <div className="font-display font-bold text-3xl text-brown-800 mb-4">
          {formatRupiah(product.price)}
        </div>
        {product.description && (
          <p className="text-brown-700 text-sm leading-relaxed mb-5 pb-5 border-b border-border">
            {product.description}
          </p>
        )}

        {variants.length > 0 && (
          <div className="mb-5">
            <div className="text-[11px] font-bold tracking-widest text-brown-300 uppercase mb-2.5">
              Pilih Varian
            </div>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`text-sm font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
                    selectedVariant?.id === v.id
                      ? 'bg-brown-800 text-cream border-brown-800'
                      : 'bg-cream-dark text-brown-700 border-border'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-9 h-9 bg-cream-dark text-lg"
              aria-label="Kurangi jumlah"
            >
              –
            </button>
            <span className="w-10 text-center font-semibold">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-9 h-9 bg-cream-dark text-lg"
              aria-label="Tambah jumlah"
            >
              +
            </button>
          </div>
          <span className="text-xs text-brown-300">
            {outOfStock ? 'Stok habis' : `Stok tersedia: ${product.stock}`}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className="flex-1 border-[1.5px] border-brown-800 text-brown-800 rounded-lg py-3.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {justAdded ? '✓ Ditambahkan' : '🧺 Tambah ke Keranjang'}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={outOfStock}
            className="flex-1 bg-brown-800 text-cream rounded-lg py-3.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Beli Sekarang
          </button>
        </div>
      </div>
    </div>
  )
}
