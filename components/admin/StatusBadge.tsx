import { statusMeta } from '@/lib/admin/config/orders.config';
import type { OrderStatus } from '@/lib/admin/types';

const badgeColors: Record<string, string> = {
  'badge-amber': 'bg-[var(--accent-bg)] text-[var(--accent-dark)]',
  'badge-blue': 'bg-[var(--blue-bg)] text-[var(--blue)]',
  'badge-purple': 'bg-[var(--purple-bg)] text-[var(--purple)]',
  'badge-green': 'bg-[var(--green-bg)] text-[var(--green)]',
  'badge-red': 'bg-[var(--red-bg)] text-[var(--red)]',
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = statusMeta[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${badgeColors[meta.badgeClass]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  );
}
