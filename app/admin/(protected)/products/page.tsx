import { createClient } from '@/lib/supabase/server';
import ProductsTable from '@/components/admin/ProductsTable';
import type { Product } from '@/lib/admin/types';

export default async function ProductsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  const products: Product[] = (data as Product[]) ?? [];

  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[var(--panel)] px-8 py-4.5">
        <h1 className="text-xl" style={{ fontFamily: 'var(--font-display)' }}>
          Produk
        </h1>
      </div>
      <div className="p-8">
        {error && (
          <div className="mb-4 rounded-lg bg-[var(--red-bg)] px-4 py-3 text-sm text-[var(--red)]">
            Gagal memuat data produk: {error.message}
          </div>
        )}
        <ProductsTable products={products} />
      </div>
    </div>
  );
}
