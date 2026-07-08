import Link from 'next/link'
import { formatRupiah } from '@/lib/utils'
import type { Product } from '@/types/database'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/produk/${product.slug}`}
      className="block bg-card border border-border rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform shadow-sm"
    >
      <div className="h-36 bg-gradient-to-br from-cream-dark to-cream flex items-center justify-center relative">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">🍪</span>
        )}
        {product.is_favorite && (
          <span className="absolute top-2.5 left-2.5 bg-danger text-red-50 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide">
            TERFAVORIT
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
            Stok Habis
          </span>
        )}
      </div>
      <div className="p-3.5">
        <div className="font-bold text-sm text-brown-800">{product.name}</div>
        <div className="text-[11px] text-brown-300 mb-2 capitalize">{product.category}</div>
        <div className="font-bold text-brown-800 text-sm">{formatRupiah(product.price)}</div>
      </div>
    </Link>
  )
}
