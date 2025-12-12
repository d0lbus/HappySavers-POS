// src/pages/Admin/Products/ProductsPage.jsx

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";


import { getProducts } from "../../../api/products";

import Tabs from "../../../components/common/Tabs";
import Button from "../../../components/common/Button";
import DataTable from "../../../components/tables/DataTable";
import Pagination from "../../../components/tables/Pagination";

export default function ProductsPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("active");
  const [search, setSearch] = useState("");

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["products", { page, status, search }],
    queryFn: () =>
      getProducts({
        page,
        limit: 20,
        q: search,
        status,
        sortBy: "name",
        sortDir: "asc",
      }).then((res) => res.data),
    keepPreviousData: true,
  });

  const products = data?.data || [];
  const meta = data?.meta || {};

  const ch = createColumnHelper();

  const columns = useMemo(() => {
    return [
      ch.accessor("name", {
        header: "Name",
        cell: (info) => info.getValue(),
      }),
      ch.accessor("sku", {
        header: "SKU",
        cell: (info) => info.getValue(),
      }),
      ch.display({
        id: "category",
        header: "Category",
        cell: (info) => info.row.original.Category?.name || "-",
      }),
      ch.accessor("selling_price", {
        header: () => <div className="text-right">Price</div>,
        cell: (info) => (
          <div className="text-right">
            ₱{Number(info.getValue()).toFixed(2)}
          </div>
        ),
      }),
      ch.display({
        id: "status",
        header: "Status",
        cell: (info) => {
          const p = info.row.original;
          const label = p.deleted_at
            ? "Archived"
            : p.is_active
            ? "Active"
            : "Inactive";

          const style =
            label === "Active"
              ? "bg-emerald-100 text-emerald-700"
              : label === "Inactive"
              ? "bg-amber-100 text-amber-700"
              : "bg-slate-200 text-slate-700";

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
        cell: (info) => {
          const p = info.row.original;

          return (
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline">
                Edit
              </Button>

              {!p.deleted_at && (
                <Button size="sm" variant="danger">
                  Archive
                </Button>
              )}

              {p.deleted_at && (
                <Button size="sm" variant="secondary">
                  Restore
                </Button>
              )}
            </div>
          );
        },
      }),
    ];
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">
          Product Management
        </h1>

        <Button variant="primary" onClick={() => navigate("/admin/products/create")} >
          + New Product
        </Button>
      </div>

      {/* Status Tabs */}
      <Tabs
        value={status}
        onChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        tabs={[
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
          { label: "Archived", value: "archived" },
        ]}
      />

      {/* Data Table */}
      <DataTable
        title={null}
        subtitle={null}
        columns={columns}
        data={products}
        isLoading={isLoading}
        error={isError ? true : null}
        emptyText="No products found."
        toolbar={{
          showSearch: true,
          searchPlaceholder: "Search name, SKU, or barcode…",
          showColumnToggle: true,
          showPageSize: false,
          rightSlot: (
            <Button variant="outline" onClick={refetch}>
              Refresh
            </Button>
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
