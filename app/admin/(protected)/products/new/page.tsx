import Link from 'next/link';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[var(--panel)] px-8 py-4.5">
        <h1 className="text-xl" style={{ fontFamily: 'var(--font-display)' }}>
          Tambah produk
        </h1>
      </div>
      <div className="p-8">
        <Link
          href="/admin/products"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]"
        >
          ← Kembali ke daftar produk
        </Link>
        <ProductForm />
      </div>
    </div>
  );
}
