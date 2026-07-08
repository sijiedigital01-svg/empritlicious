import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Catatan: client ini sengaja tidak di-generic-kan dengan tipe Database.
// Tipe hasil query dipastikan lewat interface di types/database.ts di titik
// pemakaian. Untuk type-safety penuh dari skema asli, generate tipe dengan
// `npx supabase gen types typescript --project-id <id> > types/database.ts`.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
