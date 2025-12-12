import React from 'react';

/**
 * Pagination (Reusable)
 */
export default function Pagination({
  table,
  showPageSize = true,
  pageSizeOptions = [10, 20, 50, 100],
}) {
  if (!table) return null;

  const pageIndex = table.getState().pagination?.pageIndex ?? 0;
  const pageSize = table.getState().pagination?.pageSize ?? pageSizeOptions[0];
  const pageCount = table.getPageCount();

  const canPrev = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-slate-600">
        Page <span className="font-semibold">{pageIndex + 1}</span> of{' '}
        <span className="font-semibold">{Math.max(pageCount, 1)}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 justify-end">
        {showPageSize && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Rows</span>
            <select
              value={pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
            >
              {pageSizeOptions.map((sz) => (
                <option key={sz} value={sz}>
                  {sz}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="button"
          onClick={() => table.setPageIndex(0)}
          disabled={!canPrev}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 disabled:opacity-50 hover:bg-slate-100"
          title="First"
        >
          ⏮
        </button>

        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!canPrev}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 disabled:opacity-50 hover:bg-slate-100"
          title="Previous"
        >
          ◀
        </button>

        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!canNext}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 disabled:opacity-50 hover:bg-slate-100"
          title="Next"
        >
          ▶
        </button>

        <button
          type="button"
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!canNext}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 disabled:opacity-50 hover:bg-slate-100"
          title="Last"
        >
          ⏭
        </button>

        <div className="ml-2 flex items-center gap-2">
          <span className="text-sm text-slate-600">Go</span>
          <input
            type="number"
            min={1}
            max={Math.max(pageCount, 1)}
            value={pageIndex + 1}
            onChange={(e) => {
              const v = Number(e.target.value || 1);
              const nextIndex = Math.min(
                Math.max(v - 1, 0),
                Math.max(pageCount - 1, 0)
              );
              table.setPageIndex(nextIndex);
            }}
            className="w-20 rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
          />
        </div>
      </div>
    </div>
  );
}
