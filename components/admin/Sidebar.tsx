'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '◆' },
  { href: '/admin/orders', label: 'Pesanan', icon: '▤' },
  { href: '/admin/products', label: 'Produk', icon: '▦' },
];

export default function Sidebar({ adminEmail }: { adminEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="fixed bottom-0 left-0 top-0 flex w-[230px] flex-col bg-[var(--sidebar)] text-[var(--sidebar-soft)]">
      <div className="px-6 pb-5 pt-7" style={{ fontFamily: 'var(--font-display)' }}>
        <div className="text-lg text-white">Empritlicious</div>
        <span className="mt-1 block text-[11px] font-semibold tracking-widest text-[var(--accent)]">
          ADMIN PANEL
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm ${
                active
                  ? 'bg-[var(--accent-dark)] text-white'
                  : 'text-[var(--sidebar-soft)] hover:bg-[var(--sidebar-hover)] hover:text-white'
              }`}
            >
              <span className="w-4 text-center text-sm">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#4a3823] px-5 py-5">
        <div className="mb-2.5 text-xs text-white">
          Pemilik Toko
          <small className="block font-normal text-[var(--sidebar-soft)]">{adminEmail}</small>
        </div>
        <button
          onClick={handleLogout}
          className="w-full rounded-lg border border-[#4a3823] py-2 text-xs font-semibold text-white"
        >
          Keluar
        </button>
      </div>
    </aside>
  );
}
