export const productsListColumns = [
  { key: 'name', label: 'Nama produk' },
  { key: 'category', label: 'Kategori' },
  { key: 'price', label: 'Harga' },
  { key: 'stock', label: 'Stok' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' },
] as const;

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
