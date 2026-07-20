-- ============================================================
-- ADMIN WRITE POLICIES
-- Jalankan di Supabase SQL Editor. schema.sql sebelumnya hanya punya
-- policy baca publik untuk products/product_variants — belum ada policy
-- yang mengizinkan admin (user login) insert/update. Tanpa ini, fitur
-- Kelola Produk di admin panel akan gagal simpan walau UI terlihat normal.
--
-- MVP ini single-tenant (satu project Supabase = satu klien), jadi
-- "authenticated" disamakan dengan "admin" — cukup granular untuk saat ini.
--
-- File ini aman dijalankan ulang berkali-kali (drop-then-create) —
-- tidak akan error "policy already exists" kalau sebagian sudah pernah
-- di-apply sebelumnya.
-- ============================================================

drop policy if exists "authenticated_manage_products" on products;
create policy "authenticated_manage_products"
  on products for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "authenticated_manage_variants" on product_variants;
create policy "authenticated_manage_variants"
  on product_variants for all
  to authenticated
  using (true)
  with check (true);

-- orders juga kena gap yang sama: policy lama di schema.sql cuma insert +
-- select publik, tidak ada update untuk admin. Ini yang bikin fitur "isi
-- ongkir" / "update status" di admin panel tampak sukses (toast hijau)
-- padahal baris di DB tidak berubah sama sekali (RLS diam-diam block 0 row).
drop policy if exists "authenticated_manage_orders" on orders;
create policy "authenticated_manage_orders"
  on orders for all
  to authenticated
  using (true)
  with check (true);

-- ============================================================
-- STORAGE BUCKET untuk foto produk (upload dari admin panel)
-- Mengikuti pola bucket "payment-proofs" yang sudah ada di schema.sql:
-- public bisa baca (foto produk tampil di katalog), hanya admin
-- (authenticated) yang bisa upload/ganti/hapus.
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public_read_product_images" on storage.objects;
create policy "public_read_product_images"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "authenticated_manage_product_images" on storage.objects;
create policy "authenticated_manage_product_images"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');
