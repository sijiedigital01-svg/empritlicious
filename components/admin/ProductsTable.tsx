'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DataTable from './DataTable';
import { productsListColumns } from '@/lib/admin/config/products.config';
import { fmtRupiah } from '@/lib/admin/format';
import { toggleProductActive } from '@/app/admin/(protected)/products/actions';
import type { Product } from '@/lib/admin/types';

export default function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchStatus = statusFilter ? String(p.is_active) === statusFilter : true;
      const q = search.toLowerCase();
      const matchSearch = q
        ? p.name.toLowerCase().includes(q) || (p.category ?? '').toLowerCase().includes(q)
        : true;
      return matchStatus && matchSearch;
    });
  }, [products, search, statusFilter]);

  function handleToggle(p: Product) {
    setPendingId(p.id);
    startTransition(async () => {
      await toggleProductActive(p.id, !p.is_active);
      router.refresh();
      setPendingId(null);
    });
  }

  function renderCell(p: Product, key: string) {
    switch (key) {
      case 'name':
        return (
          <div>
            <b>{p.name}</b>
            {p.is_favorite && (
              <span className="ml-1.5 rounded-full bg-[var(--accent-bg)] px-2 py-0.5 text-[10px] font-semibold text-[var(--accent-dark)]">
                ★ Favorit
              </span>
            )}
          </div>
        );
      case 'category':
        return p.category ?? '—';
      case 'price':
        return fmtRupiah(p.price);
      case 'stock':
        return (
          <span className={p.stock < 10 ? 'font-semibold text-[var(--red)]' : ''}>{p.stock}</span>
        );
      case 'status':
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              p.is_active
                ? 'bg-[var(--green-bg)] text-[var(--green)]'
                : 'bg-[var(--red-bg)] text-[var(--red)]'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {p.is_active ? 'Aktif' : 'Nonaktif'}
          </span>
        );
      case 'actions':
        return (
          <div className="flex justify-end gap-2 text-right" onClick={(e) => e.stopPropagation()}>
            <Link
              href={`/admin/products/${p.id}`}
              className="text-sm font-semibold text-[var(--accent-dark)]"
            >
              Edit
            </Link>
            <button
              onClick={() => handleToggle(p)}
              disabled={isPending && pendingId === p.id}
              className="text-sm font-semibold text-[var(--ink-soft)] disabled:opacity-50"
            >
              {p.is_active ? 'Nonaktifkan' : 'Aktifkan'}
            </button>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <input
          type="text"
          placeholder="Cari nama / kategori produk..."
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
          <option value="true">Aktif</option>
          <option value="false">Nonaktif</option>
        </select>
        <Link
          href="/admin/products/new"
          className="ml-auto rounded-lg bg-[var(--accent-dark)] px-4 py-2 text-sm font-semibold text-white"
        >
          + Tambah produk
        </Link>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)]">
        <DataTable
          columns={productsListColumns}
          rows={filtered}
          rowKey={(p) => p.id}
          renderCell={renderCell}
          emptyMessage="Tidak ada produk yang cocok"
        />
      </div>
    </div>
  );
}
