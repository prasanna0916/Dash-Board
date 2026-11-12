import React, { useState, useMemo } from 'react';
import { Download, Search, ArrowUpDown, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';

interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  isNumeric?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface StreamlitDataFrameProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  title?: string;
  caption?: string;
  fileName?: string;
}

export function StreamlitDataFrame<T extends Record<string, any>>({
  data,
  columns,
  title = 'st.dataframe(df)',
  caption,
  fileName = 'dataset_export.csv',
}: StreamlitDataFrameProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Filter based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(term)
      )
    );
  }, [data, searchTerm]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDir === 'asc' ? valA - valB : valB - valA;
      }
      return sortDir === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredData, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const exportCSV = () => {
    if (data.length === 0) return;
    const headers = columns.map((c) => c.header).join(',');
    const rows = data.map((row) =>
      columns
        .map((c) => {
          const val = row[c.key as string];
          return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
        })
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Table Toolbar */}
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-[#ff4b4b]" />
            <h3 className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
              {title}
            </h3>
            <span className="text-xs text-slate-400">
              ({filteredData.length.toLocaleString()} rows × {columns.length} cols)
            </span>
          </div>
          {caption && <p className="text-[11px] text-slate-500 mt-0.5">{caption}</p>}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick search input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter table rows..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="rounded-md border border-slate-200 bg-slate-50 pl-8 pr-3 py-1 text-xs text-slate-800 placeholder-slate-400 focus:border-[#ff4b4b] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Download CSV button matching st.download_button */}
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Download dataframe as CSV"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Interactive Table View */}
      <div className="overflow-x-auto rounded border border-slate-100 dark:border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
            <tr>
              <th className="py-2.5 px-3 text-slate-400 font-mono w-12">#</th>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() => handleSort(String(col.key))}
                  className={`py-2.5 px-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none ${
                    col.isNumeric ? 'text-right' : 'text-left'
                  }`}
                >
                  <div className={`flex items-center gap-1.5 ${col.isNumeric ? 'justify-end' : 'justify-start'}`}>
                    <span>{col.header}</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-8 text-center text-slate-500">
                  No records matching the filter criteria.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => {
                const rowIndex = (page - 1) * pageSize + idx + 1;
                return (
                  <tr
                    key={rowIndex}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-400 tabular-nums">
                      {rowIndex}
                    </td>
                    {columns.map((col) => {
                      const value = row[col.key as string];
                      return (
                        <td
                          key={String(col.key)}
                          className={`py-2 px-3 text-slate-700 dark:text-slate-300 ${
                            col.isNumeric ? 'text-right font-mono tabular-nums' : ''
                          }`}
                        >
                          {col.render ? col.render(row) : String(value ?? '-')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sortedData.length)} of{' '}
          {sortedData.length.toLocaleString()} rows
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center rounded p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-mono text-xs tabular-nums text-slate-700 dark:text-slate-300">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center rounded p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
