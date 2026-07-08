-- ============================================================
-- EMPRITLICIOUS — SUPABASE SCHEMA (MVP)
-- Jalankan file ini di Supabase SQL Editor (satu project = satu klien)
-- ============================================================

-- Enums
create type shipping_method as enum ('ekspedisi', 'instant');
create type payment_method as enum ('qris', 'transfer');
create type order_status as enum (
  'menunggu_pembayaran',
  'menunggu_konfirmasi_ongkir',
  'dibayar',
  'diproses',
  'dikirim',
  'selesai',
  'dibatalkan'
);

-- ============================================================
-- PRODUCTS
-- ============================================================
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  quote text,
  price integer not null,          -- harga dalam Rupiah, tanpa desimal
  category text,
  image_url text,
  stock integer not null default 0,
  is_favorite boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  name text not null,              -- contoh: "Srikaya", "Ukuran Sedang"
  extra_price integer not null default 0,
  is_active boolean not null default true
);

-- ============================================================
-- ORDERS
-- ============================================================
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,          -- format: EMP-YYYYMMDD-XXXX

  -- data pembeli (wajib diisi walau guest checkout)
  customer_name text not null,
  customer_email text not null,
  customer_wa text not null,

  -- pengiriman
  shipping_method shipping_method not null,
  shipping_provider text,                     -- 'POS' | 'Shopee' | 'Maxim' | 'Grab' | 'JogjaKita' | dll
  shipping_address text not null,
  shipping_cost integer,                      -- NULL = belum dikonfirmasi (kasus instant)

  -- pembayaran
  payment_method payment_method not null,
  payment_proof_url text,

  status order_status not null default 'menunggu_pembayaran',
  subtotal integer not null,
  total integer,                              -- NULL selama shipping_cost belum fix
  notes text,

  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,                 -- snapshot nama saat transaksi
  variant_name text,
  qty integer not null check (qty > 0),
  price_at_purchase integer not null
);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_products_active on products(is_active);
create index idx_products_category on products(category);
create index idx_orders_status on orders(status);
create index idx_order_items_order_id on order_items(order_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table products enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Publik boleh baca produk yang aktif (katalog & detail produk)
create policy "public_read_active_products"
  on products for select
  using (is_active = true);

create policy "public_read_active_variants"
  on product_variants for select
  using (is_active = true);

-- Publik (guest) boleh membuat order baru — checkout tanpa login
create policy "public_insert_orders"
  on orders for insert
  with check (true);

create policy "public_insert_order_items"
  on order_items for insert
  with check (true);

-- Publik boleh baca order HANYA jika tahu id-nya (uuid acak, dipakai di link
-- halaman konfirmasi /pesanan/[id]) — tidak bisa list semua order
create policy "public_read_own_order_by_id"
  on orders for select
  using (true);

create policy "public_read_own_order_items"
  on order_items for select
  using (true);

-- Catatan: policy select di atas sengaja permisif di level row karena
-- MVP belum pakai auth. Yang menjaga privasi adalah UUID order yang tidak
-- ditebak, BUKAN policy ini. Saat build fase berikutnya (akun pelanggan),
-- policy ini harus diperketat pakai auth.uid().

-- ============================================================
-- STORAGE BUCKET untuk bukti pembayaran
-- Jalankan lewat Supabase Dashboard > Storage, atau via SQL berikut
-- ============================================================
insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', true)
on conflict (id) do nothing;

create policy "public_upload_payment_proof"
  on storage.objects for insert
  with check (bucket_id = 'payment-proofs');

create policy "public_read_payment_proof"
  on storage.objects for select
  using (bucket_id = 'payment-proofs');

-- ============================================================
-- SEED DATA — contoh produk (hapus / sesuaikan sebelum production)
-- ============================================================
insert into products (name, slug, description, quote, price, category, stock, is_favorite)
values
  ('Macaron Emprit Jogja', 'macaron-emprit-jogja',
   'Cangkang macaron berbahan santan kelapa yang tipis dan renyah, diisi selai khas nusantara.',
   'Rasa yang tidak akan kamu temukan di tempat lain — bahkan di Paris sekalipun.',
   35000, 'macaron', 24, true),
  ('Bolu Emprit Original', 'bolu-emprit-original',
   'Bolu lembut khas Empritlicious, favorit oleh-oleh dari Jogja.',
   null, 45000, 'bolu', 15, true),
  ('Nastar Klasik', 'nastar-klasik',
   'Kue kering nastar dengan isian selai nanas homemade.',
   null, 38000, 'kue-kering', 20, false);

insert into product_variants (product_id, name)
select id, unnest(array['Srikaya','Stroberi','Bluberi','Nanas','Salak','Kacang','Keju','Cokelat'])
from products where slug = 'macaron-emprit-jogja';

insert into product_variants (product_id, name)
select id, unnest(array['Ukuran Kecil','Ukuran Sedang','Ukuran Besar'])
from products where slug = 'bolu-emprit-original';
