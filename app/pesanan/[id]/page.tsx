import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatRupiah } from '@/lib/utils'
import type { Order, OrderItem } from '@/types/database'

async function getOrder(id: string): Promise<{ order: Order; items: OrderItem[] } | null> {
  const { data: order, error } = await supabase.from('orders').select('*').eq('id', id).single()
  if (error || !order) return null

  const { data: items } = await supabase.from('order_items').select('*').eq('order_id', id)
  return { order, items: items ?? [] }
}

const ADMIN_WA = process.env.NEXT_PUBLIC_ADMIN_WA ?? ''

export default async function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const data = await getOrder(params.id)
  if (!data) notFound()
  const { order, items } = data

  const waMessage = encodeURIComponent(
    `Halo Empritlicious, saya sudah checkout dengan No. Pesanan ${order.order_number}. Mohon info ongkir dan konfirmasi pembayarannya ya 🙏`
  )
  const waLink = ADMIN_WA ? `https://wa.me/${ADMIN_WA}?text=${waMessage}` : '#'

  return (
    <div className="px-8 py-14 max-w-2xl mx-auto">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-20 h-20 rounded-full bg-amber-light border-2 border-amber flex items-center justify-center text-4xl mb-5">
          ✓
        </div>
        <h1 className="font-display font-bold text-2xl text-brown-800 mb-2">
          Pesanan Kamu Berhasil Dibuat!
        </h1>
        <p className="text-brown-700 max-w-md leading-relaxed mb-5">
          Terima kasih sudah belanja di Empritlicious. Ongkos kirim dan konfirmasi
          pembayaran akan kami infokan lewat WhatsApp ke nomor yang kamu daftarkan.
        </p>
        <div className="bg-card border border-dashed border-border rounded-lg px-5 py-3.5 font-display font-bold text-brown-800">
          No. Pesanan: {order.order_number}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <h3 className="font-display font-semibold text-brown-800 mb-4">Rincian Pesanan</h3>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm text-brown-700 mb-2">
            <span>
              {item.product_name}
              {item.variant_name ? ` (${item.variant_name})` : ''} × {item.qty}
            </span>
            <span>{formatRupiah(item.price_at_purchase * item.qty)}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm text-brown-700 border-t border-border pt-3 mt-2">
          <span>Subtotal</span>
          <span>{formatRupiah(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-brown-500">
          <span>Ongkos Kirim ({order.shipping_provider})</span>
          <span>Menunggu konfirmasi admin</span>
        </div>
        <div className="text-xs text-brown-300 mt-3 pt-3 border-t border-border">
          Metode pembayaran: <strong className="text-brown-700 uppercase">{order.payment_method}</strong>
          {order.payment_proof_url && ' · Bukti pembayaran sudah diunggah'}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center bg-brown-800 text-cream rounded-lg py-3.5 text-sm font-semibold"
        >
          💬 Konfirmasi via WhatsApp
        </a>
        <Link
          href="/"
          className="flex-1 text-center border-[1.5px] border-brown-800 text-brown-800 rounded-lg py-3.5 text-sm font-semibold"
        >
          Belanja Lagi
        </Link>
      </div>
    </div>
  )
}
