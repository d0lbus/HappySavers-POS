import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

import { getInventory } from "../../../api/inventory";

import Tabs from "../../../components/common/Tabs";
import Button from "../../../components/common/Button";
import DataTable from "../../../components/tables/DataTable";
import Pagination from "../../../components/tables/Pagination";

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function InventoryPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [tab, setTab] = useState("all"); // all | active | inactive
  const [search, setSearch] = useState("");

  const pageSize = 20;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => getInventory().then((res) => res.data),
    keepPreviousData: true,
  });

  const rows = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();

    return rows
      .filter((p) => {
        if (tab === "active") return Boolean(p.is_active);
        if (tab === "inactive") return !Boolean(p.is_active);
        return true;
      })
      .filter((p) => {
        if (!q) return true;
        const name = (p.name || "").toLowerCase();
        const sku = (p.sku || "").toLowerCase();
        const barcode = (p.barcode || "").toLowerCase();
        return name.includes(q) || sku.includes(q) || barcode.includes(q);
      });
  }, [rows, tab, search]);

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
          const currentStock = toNum(p.current_stock);
          const th = toNum(p.low_stock_threshold);
          const isLow = currentStock <= th;

          return (
            <div className="space-y-1">
              <div className="font-medium text-slate-900">{p.name}</div>
              <div className="text-xs text-slate-500">
                SKU: {p.sku || "-"} · Barcode: {p.barcode || "-"}
              </div>

              {isLow ? (
                <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">
                  Low stock
                </span>
              ) : null}
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
        cell: (info) => (
          <div className="text-right">{toNum(info.getValue())}</div>
        ),
      }),

      ch.display({
        id: "status",
        header: "Status",
        cell: (info) => {
          const p = info.row.original;
          const label = p.is_active ? "Active" : "Inactive";
          const style = p.is_active
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-700";

          return (
            <span className={`px-2 py-1 rounded text-xs font-medium ${style}`}>
              {label}
            </span>
          );
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
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/admin/inventory/adjust", {
                    state: { productId: p.id },
                  });
                }}
              >
                Adjust
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/admin/inventory/movements");
                }}
              >
                Movements
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
        <h1 className="text-xl font-semibold text-slate-900">
          Inventory Management
        </h1>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/inventory/low-stock")}
          >
            Low Stock
          </Button>

          <Button
            variant="primary"
            onClick={() => navigate("/admin/inventory/adjust")}
          >
            + New Adjustment
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(val) => {
          setTab(val);
          setPage(1);
        }}
        tabs={[
          { label: "All", value: "all" },
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
        ]}
      />

      {/* Table */}
      <DataTable
        title={null}
        subtitle={null}
        columns={columns}
        data={pageRows}
        isLoading={isLoading}
        error={isError ? true : null}
        emptyText="No inventory items found."
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
            <div className="flex gap-2">
              <Button variant="outline" onClick={refetch}>
                Refresh
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/admin/inventory/movements")}
              >
                View Movements
              </Button>
            </div>
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
