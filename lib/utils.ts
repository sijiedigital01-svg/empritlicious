export function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID')
}

export function generateOrderNumber(): string {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `EMP-${yyyy}${mm}${dd}-${rand}`
}

// Provider ekspedisi & instant yang bisa dipilih customer di checkout.
// Ongkir ekspedisi diisi manual dulu di MVP (belum pakai API RajaOngkir/Biteship).
export const SHIPPING_PROVIDERS = {
  ekspedisi: ['POS Indonesia'],
  instant: ['Shopee Instant', 'Maxim', 'Jogja Kita', 'Grab'],
} as const
