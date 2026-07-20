'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct, type ProductInput } from '@/app/admin/(protected)/products/actions';
import { slugify } from '@/lib/admin/config/products.config';
import { createClient } from '@/lib/supabase/client';
import type { Product } from '@/lib/admin/types';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [description, setDescription] = useState(product?.description ?? '');
  const [quote, setQuote] = useState(product?.quote ?? '');
  const [price, setPrice] = useState(String(product?.price ?? ''));
  const [category, setCategory] = useState(product?.category ?? '');
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? '');
  const [stock, setStock] = useState(String(product?.stock ?? '0'));
  const [isFavorite, setIsFavorite] = useState(product?.is_favorite ?? false);
  const [isActive, setIsActive] = useState(product?.is_active ?? true);

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploadError(null);

    if (!file.type.startsWith('image/')) {
      setUploadError('File harus berupa gambar');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setUploadError('Ukuran gambar maksimal 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { error: uploadErr } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadErr) throw new Error(uploadErr.message);

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      setImageUrl(publicUrlData.publicUrl);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Gagal upload gambar');
    } finally {
      setIsUploading(false);
    }
  }

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const input: ProductInput = {
      name,
      slug,
      description,
      quote,
      price: parseInt(price, 10) || 0,
      category,
      image_url: imageUrl,
      stock: parseInt(stock, 10) || 0,
      is_favorite: isFavorite,
      is_active: isActive,
    };

    startTransition(async () => {
      const result = isEdit
        ? await updateProduct(product!.id, input)
        : await createProduct(input);

      if (!result.success) {
        setError(result.message);
        return;
      }
      router.push('/admin/products');
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_1fr]">
      <div className="flex flex-col gap-5">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5">
          <h3 className="mb-3 text-base font-medium" style={{ fontFamily: 'var(--font-display)' }}>
            Info produk
          </h3>

          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-medium text-[var(--ink-soft)]">Nama produk</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-medium text-[var(--ink-soft)]">Slug (URL)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              required
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-medium text-[var(--ink-soft)]">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--ink-soft)]">
              Quote (opsional)
            </label>
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5">
          <h3 className="mb-3 text-base font-medium" style={{ fontFamily: 'var(--font-display)' }}>
            Gambar
          </h3>

          <label className="mb-1.5 block text-xs font-medium text-[var(--ink-soft)]">
            Upload dari komputer
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="mb-1.5 w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--accent-bg)] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[var(--accent-dark)] disabled:opacity-60"
          />
          {isUploading && (
            <p className="mb-2 text-xs text-[var(--ink-soft)]">Mengupload gambar...</p>
          )}
          {uploadError && (
            <p className="mb-2 text-xs text-[var(--red)]">{uploadError}</p>
          )}

          <label className="mb-1.5 mt-3 block text-xs font-medium text-[var(--ink-soft)]">
            Atau isi URL gambar manual
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="mt-3 h-[140px] w-full rounded-lg border border-[var(--border)] object-cover"
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5">
          <h3 className="mb-3 text-base font-medium" style={{ fontFamily: 'var(--font-display)' }}>
            Harga &amp; stok
          </h3>

          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-medium text-[var(--ink-soft)]">Harga (Rp)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min={0}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-medium text-[var(--ink-soft)]">Stok</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              min={0}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--ink-soft)]">Kategori</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="mis. macaron, bolu, kue-kering"
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5">
          <h3 className="mb-3 text-base font-medium" style={{ fontFamily: 'var(--font-display)' }}>
            Status
          </h3>
          <label className="mb-2.5 flex items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4"
            />
            Aktif (tampil di katalog)
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="h-4 w-4"
            />
            Tandai sebagai favorit
          </label>
        </div>

        {error && (
          <div className="rounded-lg bg-[var(--red-bg)] px-4 py-3 text-sm text-[var(--red)]">{error}</div>
        )}

        <button
          type="submit"
          disabled={isPending || isUploading}
          className="w-full rounded-lg bg-[var(--accent-dark)] py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending ? 'Menyimpan...' : isUploading ? 'Menunggu upload gambar...' : isEdit ? 'Simpan perubahan' : 'Tambah produk'}
        </button>
      </div>
    </form>
  );
}
