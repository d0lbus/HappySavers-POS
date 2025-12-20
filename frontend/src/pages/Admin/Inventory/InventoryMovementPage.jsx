import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

import { getInventoryMovements } from "../../../api/inventory";

import Tabs from "../../../components/common/Tabs";
import Button from "../../../components/common/Button";
import DataTable from "../../../components/tables/DataTable";
import Pagination from "../../../components/tables/Pagination";

function toStr(v) {
  return v === null || v === undefined ? "" : String(v);
}

export default function InventoryMovementPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [tab, setTab] = useState("all"); // all | in | out
  const [search, setSearch] = useState("");

  const pageSize = 25;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["inventory-movements"],
    queryFn: () => getInventoryMovements().then((res) => res.data),
    keepPreviousData: true,
  });

  const rows = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();

    return rows
      .filter((m) => {
        if (tab === "in") return m.direction === "IN";
        if (tab === "out") return m.direction === "OUT";
        return true;
      })
      .filter((m) => {
        if (!q) return true;
        const name = (m.product?.name || "").toLowerCase();
        const sku = (m.product?.sku || "").toLowerCase();
        const barcode = (m.product?.barcode || "").toLowerCase();
        const reason = (m.reason || "").toLowerCase();
        return (
          name.includes(q) ||
          sku.includes(q) ||
          barcode.includes(q) ||
          reason.includes(q)
        );
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
      ch.display({
        id: "date",
        header: "Date",
        cell: (info) => {
          const m = info.row.original;
          const d = m.created_at ? new Date(m.created_at) : null;
          return (
            <div className="text-sm text-slate-700">
              {d ? d.toLocaleString() : "-"}
            </div>
          );
        },
      }),

      ch.display({
        id: "product",
        header: "Product",
        cell: (info) => {
          const m = info.row.original;
          return (
            <div className="space-y-1">
              <div className="font-medium text-slate-900">
                {m.product?.name || "-"}
              </div>
              <div className="text-xs text-slate-500">
                SKU: {m.product?.sku || "-"} · Barcode: {m.product?.barcode || "-"}
              </div>
            </div>
          );
        },
      }),

      ch.display({
        id: "type",
        header: "Type",
        cell: (info) => {
          const m = info.row.original;
          return (
            <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">
              {m.movement_type || "-"}
            </span>
          );
        },
      }),

      ch.display({
        id: "dir",
        header: "Dir",
        cell: (info) => {
          const m = info.row.original;
          const isIn = m.direction === "IN";
          const style = isIn
            ? "bg-emerald-100 text-emerald-700"
            : "bg-rose-100 text-rose-700";
          return (
            <span className={`px-2 py-1 rounded text-xs font-medium ${style}`}>
              {m.direction || "-"}
            </span>
          );
        },
      }),

      ch.accessor("quantity", {
        header: () => <div className="text-right">Qty</div>,
        meta: { align: "right" },
        cell: (info) => <div className="text-right font-semibold">{info.getValue()}</div>,
      }),

      ch.display({
        id: "reason",
        header: "Reason",
        cell: (info) => toStr(info.row.original.reason) || "-",
      }),

      ch.display({
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        meta: { align: "right" },
        cell: (info) => {
          const m = info.row.original;
          return (
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/admin/inventory/adjust", {
                    state: { productId: m.product_id },
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
        <h1 className="text-xl font-semibold text-slate-900">
          Inventory Movements
        </h1>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/inventory")}>
            Back
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
          { label: "IN", value: "in" },
          { label: "OUT", value: "out" },
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
        emptyText="No movements found."
        toolbar={{
          showSearch: true,
          searchPlaceholder: "Search product, SKU, barcode, or reason…",
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
                onClick={() => navigate("/admin/inventory/low-stock")}
              >
                Low Stock
              </Button>
            </div>
          ),
        }}
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
