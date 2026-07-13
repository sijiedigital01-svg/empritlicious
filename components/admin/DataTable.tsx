'use client';

interface Column {
  key: string;
  label: string;
}

interface DataTableProps<T> {
  columns: readonly Column[];
  rows: T[];
  rowKey: (row: T) => string;
  renderCell: (row: T, columnKey: string) => React.ReactNode;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

// Generic table: tidak tahu apa-apa soal "pesanan" atau "produk" — cuma
// render kolom + cell sesuai fungsi renderCell yang dikirim si pemanggil.
// Reuse untuk entitas apapun cukup dengan kirim columns config + renderCell beda.
export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  renderCell,
  onRowClick,
  emptyMessage = 'Belum ada data',
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-[var(--ink-faint)]">{emptyMessage}</div>
    );
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className="border-b border-[var(--border)] px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-faint)]"
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={rowKey(row)}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={`border-b border-[var(--border)] ${onRowClick ? 'cursor-pointer hover:bg-[#FBF9F4]' : ''}`}
          >
            {columns.map((col) => (
              <td key={col.key} className="px-3 py-3 text-sm">
                {renderCell(row, col.key)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
