'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from './DataTable';
import StatusBadge from './StatusBadge';
import { ordersListColumns, orderStatusOptions } from '@/lib/admin/config/orders.config';
import { fmtRupiah, fmtTanggal } from '@/lib/admin/format';
import type { Order } from '@/lib/admin/types';

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = statusFilter ? o.status === statusFilter : true;
      const q = search.toLowerCase();
      const matchSearch = q
        ? o.customer_name.toLowerCase().includes(q) || o.order_number.toLowerCase().includes(q)
        : true;
      return matchStatus && matchSearch;
    });
  }, [orders, search, statusFilter]);

  function renderCell(o: Order, key: string) {
    switch (key) {
      case 'order_number':
        return <b>{o.order_number}</b>;
      case 'customer_name':
        return o.customer_name;
      case 'shipping':
        return o.shipping_method === 'ekspedisi'
          ? `Ekspedisi · ${o.shipping_provider}`
          : `Instant · ${o.shipping_provider}`;
      case 'total':
        return fmtRupiah(o.total);
      case 'status':
        return <StatusBadge status={o.status} />;
      case 'created_at':
        return <span className="text-[var(--ink-soft)]">{fmtTanggal(o.created_at)}</span>;
      default:
        return null;
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <input
          type="text"
          placeholder="Cari nama customer / no. order..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-[280px] flex-1 rounded-lg border border-[var(--border)] px-3.5 py-2 text-sm outline-none focus:border-[var(--accent)]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-white px-3.5 py-2 text-sm"
        >
          <option value="">Semua status</option>
          {orderStatusOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)]">
        <DataTable
          columns={ordersListColumns}
          rows={filtered}
          rowKey={(o) => o.id}
          renderCell={renderCell}
          onRowClick={(o) => router.push(`/admin/orders/${o.id}`)}
          emptyMessage="Tidak ada pesanan yang cocok"
        />
      </div>
    </div>
  );
}
