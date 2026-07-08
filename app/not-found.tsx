import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="px-8 py-20 text-center">
      <div className="text-5xl mb-4">🔍</div>
      <h1 className="font-display font-bold text-2xl text-brown-800 mb-2">Halaman tidak ditemukan</h1>
      <p className="text-brown-500 mb-6">Produk yang kamu cari mungkin sudah tidak tersedia.</p>
      <Link href="/" className="inline-block bg-brown-800 text-cream rounded-lg px-6 py-3 text-sm font-semibold">
        Kembali ke Beranda
      </Link>
    </div>
  )
}
