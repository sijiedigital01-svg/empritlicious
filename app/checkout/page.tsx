'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { supabase } from '@/lib/supabase'
import { formatRupiah, generateOrderNumber, SHIPPING_PROVIDERS } from '@/lib/utils'
import type { ShippingMethod, PaymentMethod } from '@/types/database'

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [wa, setWa] = useState('')
  const [address, setAddress] = useState('')

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('ekspedisi')
  const [shippingProvider, setShippingProvider] = useState<string>(SHIPPING_PROVIDERS.ekspedisi[0])

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris')
  const [proofFile, setProofFile] = useState<File | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  function handleShippingMethodChange(method: ShippingMethod) {
    setShippingMethod(method)
    setShippingProvider(SHIPPING_PROVIDERS[method][0])
  }

  function validate(): string | null {
    if (!name.trim()) return 'Nama penerima wajib diisi'
    if (!email.trim() || !email.includes('@')) return 'Email tidak valid'
    if (!wa.trim()) return 'Nomor WhatsApp wajib diisi'
    if (!address.trim()) return 'Alamat pengiriman wajib diisi'
    if (paymentMethod !== 'qris' && paymentMethod !== 'transfer') return 'Pilih metode pembayaran'
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setErrorMsg(validationError)
      return
    }

    setSubmitting(true)
    setErrorMsg(null)

    try {
      // 1. Upload bukti pembayaran dulu (kalau ada) supaya kita punya URL-nya
      let proofUrl: string | null = null
      if (proofFile) {
        const fileExt = proofFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(fileName, proofFile)

        if (uploadError) throw new Error('Gagal upload bukti pembayaran: ' + uploadError.message)

        const { data: publicUrlData } = supabase.storage
          .from('payment-proofs')
          .getPublicUrl(fileName)
        proofUrl = publicUrlData.publicUrl
      }

      // 2. Buat order. Ongkir belum diisi (null) karena—baik ekspedisi maupun
      // instant—akan dikonfirmasi manual lewat WhatsApp, sesuai alur MVP.
      const orderNumber = generateOrderNumber()
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: name.trim(),
          customer_email: email.trim(),
          customer_wa: wa.trim(),
          shipping_method: shippingMethod,
          shipping_provider: shippingProvider,
          shipping_address: address.trim(),
          shipping_cost: null,
          payment_method: paymentMethod,
          payment_proof_url: proofUrl,
          status: 'menunggu_konfirmasi_ongkir',
          subtotal,
          total: null,
        })
        .select()
        .single()

      if (orderError || !order) throw new Error('Gagal membuat pesanan: ' + orderError?.message)

      // 3. Simpan item-item pesanan
      const orderItemsPayload = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.name,
        variant_name: item.variantName,
        qty: item.qty,
        price_at_purchase: item.price,
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload)
      if (itemsError) throw new Error('Gagal menyimpan item pesanan: ' + itemsError.message)

      // 4. Selesai — kosongkan keranjang, arahkan ke halaman konfirmasi
      clearCart()
      router.push(`/pesanan/${order.id}`)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi kesalahan, coba lagi.')
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="px-8 py-20 text-center">
        <p className="text-brown-500">Keranjang kamu kosong. Tambahkan produk dulu sebelum checkout.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-[1.4fr_1fr] gap-8 px-8 py-9">
      <div>
        <h1 className="font-display font-bold text-2xl text-brown-800 mb-6">Checkout</h1>

        {/* Data pembeli */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-5">
          <h3 className="font-display font-semibold text-lg text-brown-800 mb-4">
            Data Pembeli & Alamat Pengiriman
          </h3>
          <p className="text-xs text-brown-300 mb-4">
            Data ini kami simpan untuk keperluan pengiriman dan komunikasi pesanan.
          </p>
          <div className="grid sm:grid-cols-2 gap-3.5 mb-3.5">
            <Field label="Nama Penerima">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Niki Andrianto" className="input" />
            </Field>
            <Field label="No. WhatsApp">
              <input value={wa} onChange={(e) => setWa(e.target.value)} placeholder="08xx xxxx xxxx" className="input" />
            </Field>
          </div>
          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="input mb-3.5"
            />
          </Field>
          <Field label="Alamat Lengkap">
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              placeholder="Jl. ..., Kecamatan, Kota"
              className="input"
            />
          </Field>
        </div>

        {/* Pengiriman */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-5">
          <h3 className="font-display font-semibold text-lg text-brown-800 mb-4">Metode Pengiriman</h3>
          <div className="flex gap-3 mb-4">
            <ShippingTab
              active={shippingMethod === 'ekspedisi'}
              onClick={() => handleShippingMethodChange('ekspedisi')}
              label="Ekspedisi"
              sub="Kirim ke luar kota"
            />
            <ShippingTab
              active={shippingMethod === 'instant'}
              onClick={() => handleShippingMethodChange('instant')}
              label="Instant"
              sub="Khusus wilayah Jogja"
            />
          </div>
          <Field label={shippingMethod === 'ekspedisi' ? 'Pilih Ekspedisi' : 'Pilih Layanan Instant'}>
            <select
              value={shippingProvider}
              onChange={(e) => setShippingProvider(e.target.value)}
              className="input"
            >
              {SHIPPING_PROVIDERS[shippingMethod].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </Field>
          <p className="text-xs text-amber-700 bg-amber-light border border-amber rounded-lg px-3.5 py-2.5 mt-3.5">
            ⓘ Ongkos kirim untuk pilihan ini akan kami konfirmasi manual lewat WhatsApp
            sebelum pesanan diproses.
          </p>
        </div>

        {/* Pembayaran */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display font-semibold text-lg text-brown-800 mb-4">Metode Pembayaran</h3>
          <PayOption
            active={paymentMethod === 'qris'}
            onClick={() => setPaymentMethod('qris')}
            label="QRIS"
            sub="Bayar instan pakai e-wallet atau m-banking apa saja"
          />
          <PayOption
            active={paymentMethod === 'transfer'}
            onClick={() => setPaymentMethod('transfer')}
            label="Transfer Bank"
            sub="BCA, Mandiri, BRI, BNI"
          />

          <div className="mt-4">
            <Field label="Upload Bukti Pembayaran (opsional saat ini, bisa dikirim menyusul via WA)">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
                className="text-sm"
              />
            </Field>
          </div>
        </div>

        {errorMsg && (
          <p className="text-sm text-danger bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 mt-4">
            {errorMsg}
          </p>
        )}
      </div>

      {/* Ringkasan */}
      <div className="bg-card border border-border rounded-2xl p-5 h-fit sticky top-24">
        <h2 className="font-display font-bold text-lg text-brown-800 mb-4">Ringkasan Pesanan</h2>
        {items.map((item) => (
          <div key={`${item.productId}-${item.variantName}`} className="flex justify-between text-sm text-brown-700 mb-2">
            <span>{item.name} × {item.qty}</span>
            <span>{formatRupiah(item.price * item.qty)}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm text-brown-700 border-t border-border pt-3 mt-2">
          <span>Subtotal</span>
          <span>{formatRupiah(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-brown-500 mb-2">
          <span>Ongkos Kirim</span>
          <span>Dikonfirmasi via WA</span>
        </div>
        <div className="flex justify-between font-bold text-brown-800 text-base border-t border-border pt-3">
          <span>Total Sementara</span>
          <span>{formatRupiah(subtotal)}</span>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brown-800 text-cream rounded-lg py-3.5 text-sm font-semibold mt-4 disabled:opacity-50"
        >
          {submitting ? 'Memproses...' : 'Buat Pesanan →'}
        </button>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid #E5DDD0;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 0.85rem;
          font-family: inherit;
          background: #fff;
        }
      `}</style>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-brown-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

function ShippingTab({
  active, onClick, label, sub,
}: { active: boolean; onClick: () => void; label: string; sub: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 text-left border rounded-lg p-3.5 ${
        active ? 'border-amber bg-amber-light' : 'border-border'
      }`}
    >
      <div className="font-semibold text-sm text-brown-800">{label}</div>
      <div className="text-xs text-brown-300">{sub}</div>
    </button>
  )
}

function PayOption({
  active, onClick, label, sub,
}: { active: boolean; onClick: () => void; label: string; sub: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 border rounded-lg p-3.5 mb-2.5 text-left ${
        active ? 'border-amber bg-amber-light' : 'border-border'
      }`}
    >
      <span
        className={`w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 ${
          active ? 'border-amber bg-amber' : 'border-brown-300'
        }`}
      />
      <span>
        <div className="font-semibold text-sm text-brown-800">{label}</div>
        <div className="text-xs text-brown-300">{sub}</div>
      </span>
    </button>
  )
}
