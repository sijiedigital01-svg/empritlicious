import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProductForm from '@/components/admin/ProductForm';
import type { Product } from '@/lib/admin/types';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) {
    notFound();
  }

  const product = data as Product;

  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[var(--panel)] px-8 py-4.5">
        <h1 className="text-xl" style={{ fontFamily: 'var(--font-display)' }}>
          Edit produk
        </h1>
      </div>
      <div className="p-8">
        <Link
          href="/admin/products"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]"
        >
          ← Kembali ke daftar produk
        </Link>
        <ProductForm product={product} />
      </div>
    </div>
  );
}
