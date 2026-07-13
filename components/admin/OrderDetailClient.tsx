'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import StatusBadge from './StatusBadge';
import { fmtRupiah } from '@/lib/admin/format';
import { orderStatusOptions } from '@/lib/admin/config/orders.config';
import { updateShippingCost, updateOrderStatus } from '@/app/admin/(protected)/orders/[id]/actions';
import type { Order, OrderStatus } from '@/lib/admin/types';

export default function OrderDetailClient({ order }: { order: Order }) {
  const [ongkirInput, setOngkirInput] = useState('');
  const [statusValue, setStatusValue] = useState<OrderStatus>(order.status);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const needsOngkir = order.status === 'menunggu_konfirmasi_ongkir';

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleSaveOngkir() {
    const value = parseInt(ongkirInput, 10);
    if (!value) {
      showToast('Isi nominal ongkir dulu ya');
      return;
    }
    startTransition(async () => {
      const result = await updateShippingCost(order.id, value);
      showToast(result.message);
    });
  }

  function handleSaveStatus() {
    startTransition(async () => {
      const result = await updateOrderStatus(order.id, statusValue);
      showToast(result.message);
    });
  }

  const waLink = `https://wa.me/${order.customer_wa.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Halo Kak ${order.customer_name}, terkait pesanan ${order.order_number}...`
  )}`;

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]"
      >
        ← Kembali ke daftar pesanan
      </Link>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-5">
          {/* Item pesanan */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5">
            <h3 className="mb-3 text-base font-medium" style={{ fontFamily: 'var(--font-display)' }}>
              Item pesanan
            </h3>
            <div>
              {order.order_items?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between border-b border-[var(--border)] py-2.5 text-sm last:border-none"
                >
                  <div>
                    {item.product_name}
                    {item.variant_name && (
                      <div className="text-xs text-[var(--ink-soft)]">
                        Varian: {item.variant_name}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-[var(--ink-soft)]">
                    {item.qty} x {fmtRupiah(item.price_at_purchase)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 border-t border-dashed border-[var(--border)] pt-3 text-sm">
              <div className="flex justify-between py-1">
                <span>Subtotal</span>
                <span>{fmtRupiah(order.subtotal)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Ongkir</span>
                <span>
                  {order.shipping_cost == null ? 'Menunggu konfirmasi' : fmtRupiah(order.shipping_cost)}
                </span>
              </div>
              <div className="flex justify-between pt-1 text-base font-bold">
                <span>Total</span>
                <span>{fmtRupiah(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Form ongkir - hanya tampil kalau statusnya menunggu konfirmasi */}
          {needsOngkir && (
            <div className="rounded-xl border border-[#EAD2A0] bg-[var(--accent-bg)] p-4">
              <p className="mb-3 text-xs leading-relaxed text-[var(--accent-dark)]">
                ⚠ Ongkir belum dikonfirmasi. Hubungi customer via WhatsApp untuk cek ongkir
                aktual, lalu isi di sini — total akan otomatis diperbarui.
              </p>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="mb-1.5 block text-xs font-medium text-[var(--ink-soft)]">
                    Biaya ongkir (Rp)
                  </label>
                  <input
                    type="number"
                    value={ongkirInput}
                    onChange={(e) => setOngkirInput(e.target.value)}
                    placeholder="mis. 15000"
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <button
                  onClick={handleSaveOngkir}
                  disabled={isPending}
                  className="rounded-lg bg-[var(--accent-dark)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Simpan &amp; lanjut proses
                </button>
              </div>
            </div>
          )}

          {/* Bukti pembayaran - opsional, tidak ada validasi wajib */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5">
            <h3 className="mb-3 text-base font-medium" style={{ fontFamily: 'var(--font-display)' }}>
              Bukti pembayaran
            </h3>
            {order.payment_proof_url ? (
              <div className="overflow-hidden rounded-lg border border-[var(--border)]">
                <a href={order.payment_proof_url} target="_blank" rel="noreferrer">
                  <img
                    src={order.payment_proof_url}
                    alt="Bukti pembayaran"
                    className="h-[140px] w-full object-cover"
                  />
                </a>
                <div className="flex items-center justify-between px-3 py-2 text-xs text-[var(--ink-soft)]">
                  <span>Diupload customer</span>
                  <a
                    href={order.payment_proof_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[var(--accent-dark)]"
                  >
                    Lihat penuh
                  </a>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-[var(--border)] bg-[#FBFAF6] p-4 text-center text-xs text-[var(--ink-faint)]">
                Belum ada bukti pembayaran diupload
                <div className="mt-1.5 inline-block rounded-full bg-[var(--border)] px-2 py-0.5 text-[10px] text-[var(--ink-soft)]">
                  Opsional — konfirmasi manual via WA
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {/* Status */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5">
            <h3 className="mb-3 text-base font-medium" style={{ fontFamily: 'var(--font-display)' }}>
              Status pesanan
            </h3>
            <select
              value={statusValue}
              onChange={(e) => setStatusValue(e.target.value as OrderStatus)}
              disabled={needsOngkir}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {orderStatusOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleSaveStatus}
              disabled={needsOngkir || isPending}
              className="mt-3 w-full rounded-lg border border-[var(--border)] py-2.5 text-sm font-semibold disabled:opacity-50"
              title={needsOngkir ? 'Isi ongkir dulu' : undefined}
            >
              Update status
            </button>
          </div>

          {/* Customer */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5">
            <h3 className="mb-3 text-base font-medium" style={{ fontFamily: 'var(--font-display)' }}>
              Customer
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="grid grid-cols-[100px_1fr]">
                <dt className="text-[var(--ink-soft)]">Nama</dt>
                <dd>{order.customer_name}</dd>
              </div>
              <div className="grid grid-cols-[100px_1fr]">
                <dt className="text-[var(--ink-soft)]">WhatsApp</dt>
                <dd>{order.customer_wa}</dd>
              </div>
              <div className="grid grid-cols-[100px_1fr]">
                <dt className="text-[var(--ink-soft)]">Email</dt>
                <dd>{order.customer_email}</dd>
              </div>
            </dl>
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] py-2.5 text-sm font-semibold"
            >
              💬 Chat via WhatsApp
            </a>
          </div>

          {/* Pengiriman */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5">
            <h3 className="mb-3 text-base font-medium" style={{ fontFamily: 'var(--font-display)' }}>
              Pengiriman
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="grid grid-cols-[100px_1fr]">
                <dt className="text-[var(--ink-soft)]">Metode</dt>
                <dd>{order.shipping_method === 'ekspedisi' ? 'Ekspedisi' : 'Instant courier'}</dd>
              </div>
              <div className="grid grid-cols-[100px_1fr]">
                <dt className="text-[var(--ink-soft)]">Kurir</dt>
                <dd>{order.shipping_provider}</dd>
              </div>
              <div className="grid grid-cols-[100px_1fr]">
                <dt className="text-[var(--ink-soft)]">Alamat</dt>
                <dd>{order.shipping_address}</dd>
              </div>
              <div className="grid grid-cols-[100px_1fr]">
                <dt className="text-[var(--ink-soft)]">Pembayaran</dt>
                <dd>{order.payment_method === 'qris' ? 'QRIS' : 'Transfer bank'}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg bg-[var(--ink)] px-5 py-2.5 text-sm text-white shadow-lg">
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
