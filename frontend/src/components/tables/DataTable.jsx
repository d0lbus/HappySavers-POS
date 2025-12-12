import React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import TableToolbar from "./TableToolbar";
import Pagination from "./Pagination";

function alignToThClass(align) {
  if (align === "right") return "text-right";
  if (align === "center") return "text-center";
  return "text-left";
}

function alignToTdClass(align) {
  if (align === "right") return "text-right";
  if (align === "center") return "text-center";
  return "text-left";
}

function alignToButtonClass(align) {
  // Button should take full width of the column
  if (align === "right") return "w-full flex items-center justify-end gap-2";
  if (align === "center") return "w-full flex items-center justify-center gap-2";
  return "w-full flex items-center justify-start gap-2";
}

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
  emptyText = "No results found.",
  toolbar,
}) {
  const [sorting, setSorting] = React.useState(initialState?.sorting ?? []);
  const [columnFilters, setColumnFilters] = React.useState(
    initialState?.columnFilters ?? []
  );
  const [globalFilter, setGlobalFilter] = React.useState(
    initialState?.globalFilter ?? ""
  );
  const [columnVisibility, setColumnVisibility] = React.useState(
    initialState?.columnVisibility ?? {}
  );

  const table = useReactTable({
    data: Array.isArray(data) ? data : [],
    columns: Array.isArray(columns) ? columns : [],
    state: { sorting, columnFilters, globalFilter, columnVisibility },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
  });

  return (
    <div className="space-y-3">
      {(title || subtitle) && (
        <div className="flex items-start justify-between gap-3">
          <div>
            {title ? (
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            ) : null}
            {subtitle ? (
              <p className="text-sm text-slate-600">{subtitle}</p>
            ) : null}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-3">
          <TableToolbar table={table} {...toolbar} />
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-slate-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-slate-200">
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sortDir = header.column.getIsSorted(); // 'asc' | 'desc' | false

                    const align = header.column.columnDef?.meta?.align || "left";

                    return (
                      <th
                        key={header.id}
                        style={{ width: header.getSize() }}
                        className={[
                          "px-4 py-3 align-middle text-xs font-semibold uppercase tracking-wide text-slate-600",
                          alignToThClass(align),
                        ].join(" ")}
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
                              alignToButtonClass(align),
                              canSort
                                ? "cursor-pointer select-none hover:text-slate-900"
                                : "cursor-default",
                            ].join(" ")}
                            title={canSort ? "Sort" : undefined}
                          >
                            <span className="inline-flex items-center">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </span>

                            {canSort ? (
                              <span className="text-[10px] text-slate-400">
                                {sortDir === "asc"
                                  ? "▲"
                                  : sortDir === "desc"
                                  ? "▼"
                                  : "↕"}
                              </span>
                            ) : null}
                          </button>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={table.getAllLeafColumns().length || 1}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    Loading…
                  </td>
                </tr>
              ) : null}

              {!isLoading && error ? (
                <tr>
                  <td
                    colSpan={table.getAllLeafColumns().length || 1}
                    className="px-4 py-10 text-center text-sm text-red-600"
                  >
                    Failed to load data.
                  </td>
                </tr>
              ) : null}

              {!isLoading && !error && table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={table.getAllLeafColumns().length || 1}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    {emptyText}
                  </td>
                </tr>
              ) : null}

              {!isLoading &&
                !error &&
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                    className={[
                      "transition",
                      onRowClick ? "cursor-pointer hover:bg-slate-50" : "",
                      rowClassName ? rowClassName(row.original) : "",
                    ].join(" ")}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const align = cell.column.columnDef?.meta?.align || "left";

                      return (
                        <td
                          key={cell.id}
                          style={{ width: cell.column.getSize() }}
                          className={[
                            "px-4 py-3 align-middle text-sm text-slate-800",
                            alignToTdClass(align),
                          ].join(" ")}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
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
