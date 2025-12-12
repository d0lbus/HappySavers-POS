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
              <h2 className="text-lg font-semibold text-slate-900">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-slate-600">{subtitle}</p>
            )}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-3">
          <TableToolbar table={table} {...toolbar} />
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-slate-200">
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sortDir = header.column.getIsSorted(); // 'asc' | 'desc' | false

                    return (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                      >
                        {header.isPlaceholder ? null : (
                          <button
                            type="button"
                            disabled={!canSort}
                            onClick={
                              canSort
                                ? header.column.getToggleSortingHandler()
                                : undefined
                            }
                            className={[
                              'inline-flex items-center gap-2',
                              canSort
                                ? 'cursor-pointer select-none hover:text-slate-900'
                                : 'cursor-default',
                            ].join(' ')}
                            title={canSort ? 'Sort' : undefined}
                          >
                            <span>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </span>

                            {canSort && (
                              <span className="text-[10px] text-slate-400">
                                {sortDir === 'asc'
                                  ? '▲'
                                  : sortDir === 'desc'
                                  ? '▼'
                                  : '↕'}
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

            <tbody className="divide-y divide-slate-100">
              {isLoading && (
                <tr>
                  <td
                    colSpan={table.getAllLeafColumns().length || 1}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    Loading…
                  </td>
                </tr>
              )}

              {!isLoading && error && (
                <tr>
                  <td
                    colSpan={table.getAllLeafColumns().length || 1}
                    className="px-4 py-10 text-center text-sm text-red-600"
                  >
                    Failed to load data.
                  </td>
                </tr>
              )}

              {!isLoading && !error && table.getRowModel().rows.length === 0 && (
                <tr>
                  <td
                    colSpan={table.getAllLeafColumns().length || 1}
                    className="px-4 py-10 text-center text-sm text-slate-500"
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
                      onRowClick ? 'cursor-pointer hover:bg-slate-50' : '',
                      rowClassName ? rowClassName(row.original) : '',
                    ].join(' ')}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3 text-sm text-slate-800"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 px-4 py-3">
          <Pagination table={table} showPageSize={toolbar?.showPageSize ?? true} />
        </div>
      </div>
    </div>
  );
}
