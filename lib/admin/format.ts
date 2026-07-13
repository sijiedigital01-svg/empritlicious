export function fmtRupiah(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—';
  return 'Rp ' + n.toLocaleString('id-ID');
}

export function fmtTanggal(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
