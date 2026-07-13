export type OrderStatus =
  | 'menunggu_konfirmasi_ongkir'
  | 'diproses'
  | 'dikirim'
  | 'selesai'
  | 'dibatalkan';

export type ShippingMethod = 'ekspedisi' | 'instant';
export type PaymentMethod = 'qris' | 'transfer';

export interface OrderItem {
  id: string;
  order_id: string;
  product_name: string;
  variant_name: string | null;
  qty: number;
  price_at_purchase: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_wa: string;
  shipping_method: ShippingMethod;
  shipping_provider: string;
  shipping_address: string;
  shipping_cost: number | null;
  payment_method: PaymentMethod;
  payment_proof_url: string | null;
  status: OrderStatus;
  subtotal: number;
  total: number | null;
  created_at: string;
  order_items?: OrderItem[];
}
