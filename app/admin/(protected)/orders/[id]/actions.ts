'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { OrderStatus } from '@/lib/admin/types';

interface ActionResult {
  success: boolean;
  message: string;
}

// Admin isi ongkir manual (hasil konfirmasi via WA) -> total dihitung ulang
// -> status otomatis pindah ke "diproses". Ini satu-satunya jalan keluar
// dari status menunggu_konfirmasi_ongkir.
export async function updateShippingCost(
  orderId: string,
  shippingCost: number
): Promise<ActionResult> {
  if (!Number.isFinite(shippingCost) || shippingCost < 0) {
    return { success: false, message: 'Nominal ongkir tidak valid' };
  }

  const supabase = await createClient();

  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('subtotal')
    .eq('id', orderId)
    .single();

  if (fetchError || !order) {
    return { success: false, message: 'Pesanan tidak ditemukan' };
  }

  const total = (order.subtotal as number) + shippingCost;

  const { error } = await supabase
    .from('orders')
    .update({ shipping_cost: shippingCost, total, status: 'diproses' as OrderStatus })
    .eq('id', orderId);

  if (error) {
    return { success: false, message: 'Gagal menyimpan ongkir: ' + error.message };
  }

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath('/admin/orders');
  return { success: true, message: 'Ongkir disimpan, status jadi "Diproses"' };
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);

  if (error) {
    return { success: false, message: 'Gagal update status: ' + error.message };
  }

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath('/admin/orders');
  return { success: true, message: 'Status pesanan diperbarui' };
}
