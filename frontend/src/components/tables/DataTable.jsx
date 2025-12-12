import React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import TableToolbar from './TableToolbar';
import Pagination from './Pagination';

/**
 * DataTable (Reusable)
 *
 * Props:
 * - columns: TanStack column defs
 * - data: array
 * - isLoading?: boolean
 * - error?: any
 * - title?: string
 * - subtitle?: string
 * - initialState?: { sorting?, pagination?, columnVisibility?, globalFilter? }
 * - onRowClick?: (rowOriginal) => void
 * - rowClassName?: (rowOriginal) => string
 * - emptyText?: string
 * - toolbar?: {
 *     showSearch?: boolean
 *     searchPlaceholder?: string
 *     leftSlot?: ReactNode
 *     rightSlot?: ReactNode
 *     showColumnToggle?: boolean
 *     showPageSize?: boolean
 *   }
 */
export default function DataTable({
  columns,
  data,
  isLoading = false,
  error = null,
  title,
  subtitle,
  initialState,
  onRowClick,
  rowClassName,
  emptyText = 'No results found.',
  toolbar,
}) {
  const [sorting, setSorting] = React.useState(initialState?.sorting ?? []);
  const [columnFilters, setColumnFilters] = React.useState(
    initialState?.columnFilters ?? []
  );
  const [globalFilter, setGlobalFilter] = React.useState(
    initialState?.globalFilter ?? ''
  );
  const [columnVisibility, setColumnVisibility] = React.useState(
    initialState?.columnVisibility ?? {}
  );

  const table = useReactTable({
    data: Array.isArray(data) ? data : [],
    columns: Array.isArray(columns) ? columns : [],
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
  });

  return (
    <div className="space-y-3">
      {(title || subtitle) && (
        <div className="flex items-start justify-between gap-3">
          <div>
            {title && (
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <TableToolbar table={table} {...toolbar} />
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b dark:border-gray-800">
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sortDir = header.column.getIsSorted(); // 'asc' | 'desc' | false

                    return (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300"
                      >
                        {header.isPlaceholder ? null : (
                          <button
                            type="button"
                            disabled={!canSort}
                            onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                            className={[
                              'inline-flex items-center gap-2',
                              canSort ? 'cursor-pointer select-none' : 'cursor-default',
                              canSort ? 'hover:text-gray-900 dark:hover:text-gray-100' : '',
                            ].join(' ')}
                            title={canSort ? 'Sort' : undefined}
                          >
                            <span>
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </span>

                            {canSort && (
                              <span className="text-[10px] text-gray-400">
                                {sortDir === 'asc' ? '▲' : sortDir === 'desc' ? '▼' : '↕'}
                              </span>
                            )}
                          </button>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-900">
              {isLoading && (
                <tr>
                  <td
                    colSpan={table.getAllLeafColumns().length || 1}
                    className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Loading…
                  </td>
                </tr>
              )}

              {!isLoading && error && (
                <tr>
                  <td
                    colSpan={table.getAllLeafColumns().length || 1}
                    className="px-4 py-10 text-center text-sm text-red-600 dark:text-red-400"
                  >
                    Failed to load data.
                  </td>
                </tr>
              )}

              {!isLoading && !error && table.getRowModel().rows.length === 0 && (
                <tr>
                  <td
                    colSpan={table.getAllLeafColumns().length || 1}
                    className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    {emptyText}
                  </td>
                </tr>
              )}

              {!isLoading &&
                !error &&
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                    className={[
                      'transition',
                      onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900' : '',
                      rowClassName ? rowClassName(row.original) : '',
                    ].join(' ')}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-800">
          <Pagination table={table} showPageSize={toolbar?.showPageSize ?? true} />
        </div>
      </div>
    </div>
  );
}
