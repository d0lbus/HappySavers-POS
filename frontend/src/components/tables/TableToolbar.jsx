import React from 'react';

/**
 * TableToolbar (Reusable)
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
          <input
            value={globalFilter}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-72 max-w-[85vw] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
          />
        )}

        {hasAnyFilter && (
          <button
            type="button"
            onClick={clearAll}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 justify-end">
        {rightSlot}

        {showColumnToggle && hideableColumns.length > 0 && (
          <details className="relative">
            <summary className="list-none cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
              Columns
            </summary>

            <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-slate-300 bg-white p-2 shadow-lg">
              <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Toggle
              </div>

              <div className="max-h-64 overflow-auto">
                {hideableColumns.map((col) => (
                  <label
                    key={col.id}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-800 hover:bg-slate-100"
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
