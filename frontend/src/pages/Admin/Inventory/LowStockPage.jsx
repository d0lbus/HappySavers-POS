import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

import { getLowStock } from "../../../api/inventory";

import Button from "../../../components/common/Button";
import DataTable from "../../../components/tables/DataTable";
import Pagination from "../../../components/tables/Pagination";

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function LowStockPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const pageSize = 20;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["inventory-low-stock"],
    queryFn: () => getLowStock().then((res) => res.data),
    keepPreviousData: true,
  });

  const rows = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    return rows.filter((p) => {
      if (!q) return true;
      const name = (p.name || "").toLowerCase();
      const sku = (p.sku || "").toLowerCase();
      const barcode = (p.barcode || "").toLowerCase();
      return name.includes(q) || sku.includes(q) || barcode.includes(q);
    });
  }, [rows, search]);

  const meta = useMemo(() => {
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    return { total, page: safePage, totalPages };
  }, [filtered.length, page]);

  const pageRows = useMemo(() => {
    const start = (meta.page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, meta.page]);

  const ch = createColumnHelper();

  const columns = useMemo(() => {
    return [
      ch.accessor("name", {
        header: "Product",
        cell: (info) => {
          const p = info.row.original;
          return (
            <div className="space-y-1">
              <div className="font-medium text-slate-900">{p.name}</div>
              <div className="text-xs text-slate-500">
                SKU: {p.sku || "-"} · Barcode: {p.barcode || "-"}
              </div>
            </div>
          );
        },
      }),

      ch.display({
        id: "stock",
        header: () => <div className="text-right">Stock</div>,
        meta: { align: "right" },
        cell: (info) => (
          <div className="text-right font-semibold">
            {toNum(info.row.original.current_stock)}
          </div>
        ),
      }),

      ch.accessor("low_stock_threshold", {
        header: () => <div className="text-right">Threshold</div>,
        meta: { align: "right" },
        cell: (info) => <div className="text-right">{toNum(info.getValue())}</div>,
      }),

      ch.display({
        id: "reorder",
        header: () => <div className="text-right">Reorder Hint</div>,
        meta: { align: "right" },
        cell: (info) => {
          const p = info.row.original;
          const stock = toNum(p.current_stock);
          const th = toNum(p.low_stock_threshold);
          const suggested = Math.max(th - stock, 0);
          return <div className="text-right">{suggested ? `${suggested}` : "-"}</div>;
        },
      }),

      ch.display({
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        meta: { align: "right" },
        cell: (info) => {
          const p = info.row.original;
          return (
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/admin/inventory/adjust", {
                    state: { productId: p.id },
                  });
                }}
              >
                Adjust
              </Button>
            </div>
          );
        },
      }),
    ];
  }, [navigate]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Low Stock</h1>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/inventory")}>
            Back
          </Button>
          <Button variant="outline" onClick={refetch}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        title={null}
        subtitle={null}
        columns={columns}
        data={pageRows}
        isLoading={isLoading}
        error={isError ? true : null}
        emptyText="No low stock items found."
        toolbar={{
          showSearch: true,
          searchPlaceholder: "Search name, SKU, or barcode…",
          showColumnToggle: true,
          showPageSize: false,
          onSearchChange: (val) => {
            setSearch(val);
            setPage(1);
          },
          rightSlot: (
            <Button
              variant="primary"
              onClick={() => navigate("/admin/inventory/adjust")}
            >
              + New Adjustment
            </Button>
          ),
        }}
        onRowClick={(row) =>
          navigate("/admin/inventory/adjust", { state: { productId: row.id } })
        }
      />

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
