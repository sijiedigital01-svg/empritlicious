'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

interface ActionResult {
  success: boolean;
  message: string;
  id?: string;
}

export interface ProductInput {
  name: string;
  slug: string;
  description: string;
  quote: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
  is_favorite: boolean;
  is_active: boolean;
}

function validate(input: ProductInput): string | null {
  if (!input.name.trim()) return 'Nama produk wajib diisi';
  if (!input.slug.trim()) return 'Slug wajib diisi';
  if (!Number.isFinite(input.price) || input.price < 0) return 'Harga tidak valid';
  if (!Number.isFinite(input.stock) || input.stock < 0) return 'Stok tidak valid';
  return null;
}

export async function createProduct(input: ProductInput): Promise<ActionResult> {
  const validationError = validate(input);
  if (validationError) return { success: false, message: validationError };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .insert({
      name: input.name.trim(),
      slug: input.slug.trim(),
      description: input.description.trim() || null,
      quote: input.quote.trim() || null,
      price: input.price,
      category: input.category.trim() || null,
      image_url: input.image_url.trim() || null,
      stock: input.stock,
      is_favorite: input.is_favorite,
      is_active: input.is_active,
    })
    .select('id')
    .single();

  if (error) {
    const message = error.code === '23505' ? 'Slug sudah dipakai produk lain' : 'Gagal menyimpan produk: ' + error.message;
    return { success: false, message };
  }

  revalidatePath('/admin/products');
  revalidatePath('/');
  revalidatePath(`/produk/${input.slug.trim()}`);
  return { success: true, message: 'Produk berhasil ditambahkan', id: data.id };
}

export async function updateProduct(productId: string, input: ProductInput): Promise<ActionResult> {
  const validationError = validate(input);
  if (validationError) return { success: false, message: validationError };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from('products')
    .select('slug')
    .eq('id', productId)
    .single();

  const { error } = await supabase
    .from('products')
    .update({
      name: input.name.trim(),
      slug: input.slug.trim(),
      description: input.description.trim() || null,
      quote: input.quote.trim() || null,
      price: input.price,
      category: input.category.trim() || null,
      image_url: input.image_url.trim() || null,
      stock: input.stock,
      is_favorite: input.is_favorite,
      is_active: input.is_active,
    })
    .eq('id', productId);

  if (error) {
    const message = error.code === '23505' ? 'Slug sudah dipakai produk lain' : 'Gagal menyimpan produk: ' + error.message;
    return { success: false, message };
  }

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath('/');
  revalidatePath(`/produk/${input.slug.trim()}`);
  if (existing && existing.slug !== input.slug.trim()) {
    revalidatePath(`/produk/${existing.slug}`);
  }
  return { success: true, message: 'Perubahan produk disimpan' };
}

export async function toggleProductActive(productId: string, isActive: boolean): Promise<ActionResult> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from('products')
    .select('slug')
    .eq('id', productId)
    .single();

  const { error } = await supabase.from('products').update({ is_active: isActive }).eq('id', productId);

  if (error) {
    return { success: false, message: 'Gagal mengubah status: ' + error.message };
  }

  revalidatePath('/admin/products');
  revalidatePath('/');
  if (existing) revalidatePath(`/produk/${existing.slug}`);
  return { success: true, message: isActive ? 'Produk diaktifkan' : 'Produk dinonaktifkan' };
}
