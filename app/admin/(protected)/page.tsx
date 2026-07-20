import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import StatusBadge from '@/components/admin/StatusBadge';
import { fmtRupiah } from '@/lib/admin/format';
import type { Order } from '@/lib/admin/types';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: ordersData } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: productsData } = await supabase.from('products').select('id, stock, is_active');

  const orders: Order[] = (ordersData as Order[]) ?? [];
  const products = productsData ?? [];

  const menungguOngkir = orders.filter((o) => o.status === 'menunggu_konfirmasi_ongkir').length;
  const diproses = orders.filter((o) => o.status === 'diproses').length;

  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const revenueBulanIni = orders
    .filter((o) => o.status === 'selesai' && new Date(o.created_at) >= firstOfMonth)
    .reduce((sum, o) => sum + (o.total ?? 0), 0);

  const stokMenipis = products.filter((p) => p.is_active && (p.stock ?? 0) < 10).length;

  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[var(--panel)] px-8 py-4.5">
        <h1 className="text-xl" style={{ fontFamily: 'var(--font-display)' }}>
          Dashboard
        </h1>
      </div>

      <div className="p-8">
        <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-[#EAD2A0] bg-[var(--accent-bg)] p-5">
            <div className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
              {menungguOngkir}
            </div>
            <div className="mt-1 text-xs text-[var(--ink-soft)]">Menunggu konfirmasi ongkir</div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5">
            <div className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
              {diproses}
            </div>
            <div className="mt-1 text-xs text-[var(--ink-soft)]">Sedang diproses</div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5">
            <div className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
              {fmtRupiah(revenueBulanIni)}
            </div>
            <div className="mt-1 text-xs text-[var(--ink-soft)]">Pendapatan bulan ini (selesai)</div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5">
            <div className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
              {stokMenipis}
            </div>
            <div className="mt-1 text-xs text-[var(--ink-soft)]">Produk stok menipis (&lt;10)</div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-medium" style={{ fontFamily: 'var(--font-display)' }}>
              Pesanan terbaru
            </h3>
            <Link href="/admin/orders" className="text-sm font-semibold text-[var(--accent-dark)]">
              Lihat semua pesanan →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-8 text-center text-sm text-[var(--ink-faint)]">
              Belum ada pesanan masuk
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-[var(--border)] px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-faint)]">
                    No. order
                  </th>
                  <th className="border-b border-[var(--border)] px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-faint)]">
                    Customer
                  </th>
                  <th className="border-b border-[var(--border)] px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-faint)]">
                    Total
                  </th>
                  <th className="border-b border-[var(--border)] px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-faint)]">
                    Status
                  </th>
                  <th className="border-b border-[var(--border)] px-3 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-[var(--border)] last:border-none">
                    <td className="px-3 py-3 text-sm font-semibold">{o.order_number}</td>
                    <td className="px-3 py-3 text-sm">{o.customer_name}</td>
                    <td className="px-3 py-3 text-sm">{fmtRupiah(o.total)}</td>
                    <td className="px-3 py-3 text-sm">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-3 py-3 text-right text-sm">
                      <Link href={`/admin/orders/${o.id}`} className="font-semibold text-[var(--accent-dark)]">
                        Lihat →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
