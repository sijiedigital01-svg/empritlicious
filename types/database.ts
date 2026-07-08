export type ShippingMethod = 'ekspedisi' | 'instant'
export type PaymentMethod = 'qris' | 'transfer'
export type OrderStatus =
  | 'menunggu_pembayaran'
  | 'menunggu_konfirmasi_ongkir'
  | 'dibayar'
  | 'diproses'
  | 'dikirim'
  | 'selesai'
  | 'dibatalkan'

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  quote: string | null
  price: number
  category: string | null
  image_url: string | null
  stock: number
  is_favorite: boolean
  is_active: boolean
  created_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  name: string
  extra_price: number
  is_active: boolean
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_wa: string
  shipping_method: ShippingMethod
  shipping_provider: string | null
  shipping_address: string
  shipping_cost: number | null
  payment_method: PaymentMethod
  payment_proof_url: string | null
  status: OrderStatus
  subtotal: number
  total: number | null
  notes: string | null
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  variant_name: string | null
  qty: number
  price_at_purchase: number
}

