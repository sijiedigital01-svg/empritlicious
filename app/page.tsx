import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import type { Product } from '@/types/database'

export const revalidate = 60 // re-fetch katalog tiap 60 detik

async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('is_favorite', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Gagal mengambil produk:', error.message)
    return []
  }
  return data ?? []
}

export default async function HomePage() {
  const products = await getProducts()

  return (
    <div>
      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-10 px-8 py-14 items-center bg-gradient-to-b from-[#FDF8EE] to-cream border-b border-border">
        <div>
          <span className="eyebrow mb-4">✦ Est. Yogyakarta ✦</span>
          <h1 className="font-display font-bold text-4xl leading-tight text-brown-800 my-4">
            Oleh-oleh Jogja yang <em className="text-amber italic">ditunggu-tunggu</em> orang rumah.
          </h1>
          <p className="text-brown-700 max-w-md leading-relaxed mb-6">
            Kenangan kecil yang lahir dan besar di Jogja — dibuat tangan, dititipkan rasa,
            dan sekarang bisa dipesan langsung dari website, tanpa antre di toko.
          </p>
          <Link
            href="#katalog"
            className="inline-block bg-brown-800 text-cream rounded-lg px-6 py-3.5 text-sm font-semibold"
          >
            Belanja Sekarang ↗
          </Link>
        </div>
        <div className="bg-card border border-border rounded-2xl h-72 flex items-center justify-center text-7xl shadow-lg">
          🥮
        </div>
      </section>

      {/* Katalog */}
      <section id="katalog" className="px-8 py-11">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-brown-800">Semua Produk</h2>
            <p className="text-brown-300 text-sm mt-1">{products.length} produk tersedia</p>
          </div>
        </div>

        {products.length === 0 ? (
          <p className="text-brown-500 text-sm">
            Belum ada produk aktif. Tambahkan produk lewat Supabase Table Editor.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
