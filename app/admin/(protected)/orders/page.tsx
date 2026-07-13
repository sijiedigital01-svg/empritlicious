import { createClient } from '@/lib/supabase/server';
import OrdersTable from '@/components/admin/OrdersTable';
import type { Order } from '@/lib/admin/types';

export default async function OrdersPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  const orders: Order[] = (data as Order[]) ?? [];

  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[var(--panel)] px-8 py-4.5">
        <h1 className="text-xl" style={{ fontFamily: 'var(--font-display)' }}>
          Pesanan
        </h1>
      </div>
      <div className="p-8">
        {error && (
          <div className="mb-4 rounded-lg bg-[var(--red-bg)] px-4 py-3 text-sm text-[var(--red)]">
            Gagal memuat data pesanan: {error.message}
          </div>
        )}
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}
