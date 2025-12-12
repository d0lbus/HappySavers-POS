import React from 'react';

/**
 * TableToolbar (Reusable)
 *
 * Props:
 * - table: TanStack table instance (required)
 * - showSearch?: boolean (default true)
 * - searchPlaceholder?: string
 * - leftSlot?: ReactNode
 * - rightSlot?: ReactNode
 * - showColumnToggle?: boolean (default true)
 */
export default function TableToolbar({
  table,
  showSearch = true,
  searchPlaceholder = 'Search…',
  leftSlot,
  rightSlot,
  showColumnToggle = true,
}) {
  if (!table) return null;

  const globalFilter = table.getState().globalFilter ?? '';

  const clearAll = () => {
    table.setGlobalFilter('');
    table.resetColumnFilters();
    table.resetSorting();
  };

  const hasAnyFilter =
    Boolean(globalFilter) ||
    (table.getState().columnFilters?.length ?? 0) > 0 ||
    (table.getState().sorting?.length ?? 0) > 0;

  const hideableColumns = table
    .getAllLeafColumns()
    .filter((c) => c.getCanHide?.() && c.columnDef?.header);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {leftSlot}

        {showSearch && (
          <div className="relative">
            <input
              value={globalFilter}
              onChange={(e) => table.setGlobalFilter(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-72 max-w-[85vw] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-0 focus:border-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-700"
            />
          </div>
        )}

        {hasAnyFilter && (
          <button
            type="button"
            onClick={clearAll}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-900"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 justify-end">
        {rightSlot}

        {showColumnToggle && hideableColumns.length > 0 && (
          <details className="relative">
            <summary className="list-none cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-900">
              Columns
            </summary>

            <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-950">
              <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Toggle
              </div>

              <div className="max-h-64 overflow-auto">
                {hideableColumns.map((col) => (
                  <label
                    key={col.id}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-800 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-900"
                  >
                    <input
                      type="checkbox"
                      checked={col.getIsVisible()}
                      onChange={col.getToggleVisibilityHandler()}
                      className="h-4 w-4"
                    />
                    <span className="truncate">
                      {typeof col.columnDef.header === 'string'
                        ? col.columnDef.header
                        : col.id}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
