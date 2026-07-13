import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import OrderDetailClient from '@/components/admin/OrderDetailClient';
import type { Order } from '@/lib/admin/types';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', params.id)
    .single();

  if (error || !data) {
    notFound();
  }

  const order = data as Order;

  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[var(--panel)] px-8 py-4.5">
        <h1 className="text-xl" style={{ fontFamily: 'var(--font-display)' }}>
          Pesanan {order.order_number}
        </h1>
      </div>
      <div className="p-8">
        <OrderDetailClient order={order} />
      </div>
    </div>
  );
}
