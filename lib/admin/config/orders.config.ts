import type { OrderStatus } from '@/lib/admin/types';

// Kolom untuk DataTable generic di halaman list pesanan.
// Detail pesanan sengaja TIDAK pakai config generic — logic ongkir & status
// terlalu spesifik untuk digeneralisasi tanpa bikin komponen jadi rumit.
// Untuk klien lain yang butuh admin panel, cukup bikin orders.config.ts
// baru dengan kolom yang relevan dari skema mereka.
export const ordersListColumns = [
  { key: 'order_number', label: 'No. order' },
  { key: 'customer_name', label: 'Customer' },
  { key: 'shipping', label: 'Pengiriman' },
  { key: 'total', label: 'Total' },
  { key: 'status', label: 'Status' },
  { key: 'created_at', label: 'Tanggal' },
] as const;

export const statusMeta: Record<OrderStatus, { label: string; badgeClass: string }> = {
  menunggu_konfirmasi_ongkir: { label: 'Menunggu ongkir', badgeClass: 'badge-amber' },
  diproses: { label: 'Diproses', badgeClass: 'badge-blue' },
  dikirim: { label: 'Dikirim', badgeClass: 'badge-purple' },
  selesai: { label: 'Selesai', badgeClass: 'badge-green' },
  dibatalkan: { label: 'Dibatalkan', badgeClass: 'badge-red' },
};

export const orderStatusOptions = Object.entries(statusMeta).map(([value, meta]) => ({
  value: value as OrderStatus,
  label: meta.label,
}));
