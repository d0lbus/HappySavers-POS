// src/pages/Admin/Products/ProductsPage.jsx

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

import {
  getProducts,
  toggleProductStatus,
  archiveProduct,
  restoreProduct,
} from "../../../api/products";

import Tabs from "../../../components/common/Tabs";
import Button from "../../../components/common/Button";
import DataTable from "../../../components/tables/DataTable";
import Pagination from "../../../components/tables/Pagination";

export default function ProductsPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("active"); // active | inactive | archived
  const [search, setSearch] = useState("");

  // confirm modal state
  const [confirm, setConfirm] = useState(null);
  // { type: 'archive'|'restore'|'toggle', product }

  const { data, isLoading, isError, refetch } = useQuery({
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

  const archiveMut = useMutation({
    mutationFn: (id) => archiveProduct(id),
    onSuccess: async () => {
      setConfirm(null);
      await qc.invalidateQueries({ queryKey: ["products"] });
      await qc.invalidateQueries({ queryKey: ["product"] });
    },
  });

  const restoreMut = useMutation({
    mutationFn: (id) => restoreProduct(id),
    onSuccess: async () => {
      setConfirm(null);
      await qc.invalidateQueries({ queryKey: ["products"] });
      await qc.invalidateQueries({ queryKey: ["product"] });
    },
  });

  const toggleMut = useMutation({
    mutationFn: (id) => toggleProductStatus(id),
    onSuccess: async () => {
      setConfirm(null);
      await qc.invalidateQueries({ queryKey: ["products"] });
      await qc.invalidateQueries({ queryKey: ["product"] });
    },
  });

  const busy =
    archiveMut.isPending || restoreMut.isPending || toggleMut.isPending;

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
        meta: { align: "right" },
        cell: (info) => (
          <div className="text-right">₱{Number(info.getValue()).toFixed(2)}</div>
        ),
      }),

      // STATUS BADGE (uses deleted_at only)
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

      // ACTIONS
      ch.display({
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        meta: { align: "right" },
        cell: (info) => {
          const p = info.row.original;

          // IMPORTANT: archived state must come from deleted_at ONLY
          const isArchived = Boolean(p.deleted_at);
          const isActive = Boolean(p.is_active);

          return (
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/products/${p.id}/edit`);
                }}
              >
                Edit
              </Button>

              {!isArchived ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirm({ type: "toggle", product: p });
                    }}
                    disabled={busy}
                  >
                    {isActive ? "Deactivate" : "Activate"}
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirm({ type: "archive", product: p });
                    }}
                    disabled={busy}
                  >
                    Archive
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirm({ type: "restore", product: p });
                  }}
                  disabled={busy}
                >
                  Unarchive
                </Button>
              )}
            </div>
          );
        },
      }),
    ];
  }, [navigate, busy]);

  const onConfirm = () => {
    if (!confirm?.product?.id) return;

    const id = confirm.product.id;

    if (confirm.type === "archive") archiveMut.mutate(id);
    if (confirm.type === "restore") restoreMut.mutate(id);
    if (confirm.type === "toggle") toggleMut.mutate(id);
  };

  const confirmTitle =
    confirm?.type === "archive"
      ? "Archive product?"
      : confirm?.type === "restore"
      ? "Restore product?"
      : confirm?.type === "toggle"
      ? confirm?.product?.is_active
        ? "Deactivate product?"
        : "Activate product?"
      : "";

  const confirmDesc =
    confirm?.type === "archive"
      ? "This will move the product to Archived. It will be hidden from cashier selling screen."
      : confirm?.type === "restore"
      ? "This will restore the product back to the list (Active/Inactive preserved)."
      : confirm?.type === "toggle"
      ? "This will change whether the product appears on cashier selling screen."
      : "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">
          Product Management
        </h1>

        <Button
          variant="primary"
          onClick={() => navigate("/admin/products/create")}
        >
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
            <Button variant="outline" onClick={refetch} disabled={busy}>
              Refresh
            </Button>
          ),
        }}
        onRowClick={(row) => navigate(`/admin/products/${row.id}/edit`)}
      />

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Confirm Modal */}
      {confirm ? (
        <ConfirmModal
          title={confirmTitle}
          description={confirmDesc}
          confirmText={busy ? "Working…" : "Confirm"}
          cancelText="Cancel"
          onCancel={() => setConfirm(null)}
          onConfirm={onConfirm}
          disabled={busy}
        />
      ) : null}
    </div>
  );
}

/* -------------------------
   Minimal Confirm Modal
------------------------- */
function ConfirmModal({
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  disabled,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 border border-slate-200">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-600">{description}</p>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onCancel} disabled={disabled}>
            {cancelText}
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={disabled}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
