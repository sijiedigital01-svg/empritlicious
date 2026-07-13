import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// PENTING: jangan pasang generic <Database> di sini — pernah bikin
// .insert()/.update() ke-infer sebagai `never`. Tipe return dipasang
// manual di boundary function masing-masing (lihat actions.ts).
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Dipanggil dari Server Component tanpa write access ke cookies —
            // aman diabaikan selama middleware sudah handle refresh session.
          }
        },
      },
    }
  );
}
