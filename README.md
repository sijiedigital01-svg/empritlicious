# Empritlicious — MVP Website

Katalog → Detail Produk → Keranjang → Checkout → Konfirmasi.
Next.js 14 (App Router) + Tailwind CSS + Supabase.

## 1. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com) (pakai akun khusus klien ini,
   satu akun Supabase = satu klien, sesuai strategi isolasi data).
2. Buka **SQL Editor** → jalankan seluruh isi `supabase/schema.sql`.
   Ini akan membuat semua tabel, RLS policy, storage bucket `payment-proofs`,
   dan 3 produk contoh untuk testing.
3. Buka **Project Settings → API**, salin:
   - `Project URL`
   - `anon public` key

## 2. Setup project lokal

```bash
npm install
cp .env.local.example .env.local
```

Isi `.env.local` dengan kredensial dari langkah 1:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADMIN_WA=6281234567890
```

`NEXT_PUBLIC_ADMIN_WA` dipakai di halaman konfirmasi untuk tombol
"Konfirmasi via WhatsApp" — isi dengan nomor WA admin/toko (format 62xxx, tanpa +/spasi).

Jalankan:

```bash
npm run dev
```

Buka `http://localhost:3000`.

## 3. Alur yang sudah jadi di MVP ini

- **Katalog** (`/`) — ambil produk aktif dari Supabase, urut favorit dulu.
- **Detail produk** (`/produk/[slug]`) — pilih varian & jumlah, tambah ke keranjang.
- **Keranjang** (`/keranjang`) — state di browser (localStorage), belum masuk DB
  sampai checkout dikonfirmasi. Aman ditinggal refresh/tutup tab.
- **Checkout** (`/checkout`) — guest checkout (wajib isi nama, email, WA, alamat),
  pilih metode pengiriman (Ekspedisi/Instant + pilih penyedia), pilih pembayaran
  (QRIS/Transfer), opsional upload bukti bayar. Submit → insert ke tabel `orders`
  + `orders_items` di Supabase.
- **Konfirmasi** (`/pesanan/[id]`) — baca order dari Supabase by ID, tombol
  langsung ke WhatsApp admin untuk lanjut konfirmasi ongkir & pembayaran.

**Keputusan desain penting:** ongkos kirim TIDAK dihitung otomatis di website,
baik untuk Ekspedisi (POS) maupun Instant (Shopee/Maxim/Grab/dll) — sesuai
kesepakatan, ini dikonfirmasi manual lewat WhatsApp setelah order masuk.
Kalau nanti volume order naik dan mau otomatisasi ongkir ekspedisi,
tinggal integrasi API RajaOngkir/Biteship di `app/checkout/page.tsx`.

## 4. Kelola produk & pesanan (tanpa dashboard custom dulu)

Untuk MVP, admin/kamu kelola produk dan pesanan langsung lewat
**Supabase Table Editor** (Dashboard → Table Editor):

- Tambah/edit produk → tabel `products` (isi `image_url` dengan link foto
  yang sudah diupload ke Storage bucket sendiri, atau host eksternal).
- Tambah varian → tabel `product_variants`, isi `product_id` sesuai produk.
- Pantau pesanan masuk → tabel `orders`, update kolom `status` dan
  `shipping_cost` + `total` setelah dikonfirmasi manual ke customer.

Dashboard admin custom bisa dibangun di fase berikutnya kalau proses manual
ini mulai terasa lambat.

## 5. Deploy ke Vercel

1. Push project ini ke repo GitHub.
2. Di Vercel (Akun B — yang nanti di-upgrade ke Pro setelah klien ke-2),
   import repo tersebut.
3. Saat setup, masukkan 3 environment variable yang sama seperti `.env.local`.
4. Deploy. Test seluruh alur (checkout sampai masuk ke tabel `orders`)
   di URL production sebelum diserahkan ke Empritlicious.

## 6. Struktur folder

```
app/
  page.tsx                  → Beranda + Katalog
  produk/[slug]/page.tsx     → Detail produk (server) + Client component
  keranjang/page.tsx        → Keranjang (client, localStorage)
  checkout/page.tsx         → Form checkout + submit ke Supabase
  pesanan/[id]/page.tsx     → Konfirmasi pesanan
components/
  Header.tsx, Footer.tsx, ProductCard.tsx
lib/
  supabase.ts               → Supabase client
  cart-context.tsx          → React Context untuk keranjang
  utils.ts                  → format Rupiah, generate no. pesanan, dll
types/
  database.ts               → Tipe TypeScript sesuai skema
supabase/
  schema.sql                → Jalankan sekali di Supabase SQL Editor
```
