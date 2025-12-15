import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

import Tabs from "../../../components/common/Tabs";
import Button from "../../../components/common/Button";
import DataTable from "../../../components/tables/DataTable";
import Pagination from "../../../components/tables/Pagination";

import { getPromotions, updatePromotion, deletePromotion } from "../../../api/promotions";

export default function PromotionsPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("active"); // active | inactive
  const [search, setSearch] = useState("");

  // confirm modal state
  const [confirm, setConfirm] = useState(null);
  // { type: 'delete'|'toggle', promo }

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["promotions", { page, status, search }],
    queryFn: async () => {
      // If your backend doesn't support paging yet, it will still work.
      const res = await getPromotions({
        page,
        limit: 20,
        q: search,
        status, // backend may ignore for now; UI still filters below
        sortBy: "createdAt",
        sortDir: "desc",
      });

      // UI-side filtering fallback (in case backend doesn’t implement status/q yet)
      const list = Array.isArray(res.data) ? res.data : [];
      const filtered = list
        .filter((p) => {
          const isActive = p.status === "ACTIVE";
          return status === "active" ? isActive : !isActive;
        })
        .filter((p) => {
          if (!search) return true;
          const q = search.toLowerCase();
          return (
            (p.name || "").toLowerCase().includes(q) ||
            (p.type || "").toLowerCase().includes(q)
          );
        });

      // If backend is not paginated, we "fake paginate" on UI
      const limit = 20;
      const start = (page - 1) * limit;
      const paged = filtered.slice(start, start + limit);
      const totalPages = Math.max(1, Math.ceil(filtered.length / limit));

      return {
        data: paged,
        meta: {
          page,
          totalPages,
          total: filtered.length,
          limit,
        },
      };
    },
    keepPreviousData: true,
  });

  const promos = data?.data || [];
  const meta = data?.meta || {};

  const toggleMut = useMutation({
    mutationFn: ({ id, nextStatus }) => updatePromotion(id, { status: nextStatus }),
    onSuccess: async () => {
      setConfirm(null);
      await qc.invalidateQueries({ queryKey: ["promotions"] });
      await qc.invalidateQueries({ queryKey: ["promotion"] });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id) => deletePromotion(id),
    onSuccess: async () => {
      setConfirm(null);
      await qc.invalidateQueries({ queryKey: ["promotions"] });
      await qc.invalidateQueries({ queryKey: ["promotion"] });
    },
  });

  const busy = toggleMut.isPending || deleteMut.isPending;

  const ch = createColumnHelper();

  const columns = useMemo(() => {
    return [
      ch.accessor("name", {
        header: "Promotion",
        cell: (info) => info.getValue(),
      }),

      ch.accessor("type", {
        header: "Type",
        cell: (info) => {
          const t = info.getValue();
          const label =
            t === "PERCENT" ? "Percent" :
            t === "FIXED" ? "Fixed" :
            t === "BOGO" ? "BOGO" :
            t === "BUNDLE" ? "Bundle" :
            t || "-";
          return <span className="text-sm">{label}</span>;
        },
      }),

      ch.accessor("value", {
        header: () => <div className="text-right">Value</div>,
        meta: { align: "right" },
        cell: (info) => {
          const row = info.row.original;
          const v = row.value;

          if (row.type === "PERCENT" && v != null) return <div className="text-right">{Number(v)}%</div>;
          if (row.type === "FIXED" && v != null) return <div className="text-right">₱{Number(v).toFixed(2)}</div>;

          // For BOGO/BUNDLE in Phase B, value may be null
          return <div className="text-right">-</div>;
        },
      }),

      ch.display({
        id: "targets",
        header: "Targets",
        cell: (info) => {
          const p = info.row.original;
          const prodCount = Array.isArray(p.products) ? p.products.length : 0;
          const catCount = Array.isArray(p.categories) ? p.categories.length : 0;

          return (
            <div className="text-sm text-slate-700">
              <span className="font-medium">{prodCount}</span> products
              <span className="mx-2 text-slate-300">|</span>
              <span className="font-medium">{catCount}</span> categories
            </div>
          );
        },
      }),

      ch.display({
        id: "dateRange",
        header: "Schedule",
        cell: (info) => {
          const p = info.row.original;
          const s = p.start_date ? new Date(p.start_date) : null;
          const e = p.end_date ? new Date(p.end_date) : null;

          const fmt = (d) =>
            d
              ? d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" })
              : "-";

          return (
            <div className="text-sm text-slate-700">
              {fmt(s)} <span className="text-slate-400">→</span> {fmt(e)}
            </div>
          );
        },
      }),

      ch.display({
        id: "status",
        header: "Status",
        cell: (info) => {
          const p = info.row.original;
          const label = p.status === "ACTIVE" ? "Active" : "Inactive";
          const style =
            label === "Active"
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
          const isActive = p.status === "ACTIVE";

          return (
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/products/promotions/${p.id}/edit`);
                }}
              >
                Edit
              </Button>

              <Button
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirm({ type: "toggle", promo: p });
                }}
              >
                {isActive ? "Deactivate" : "Activate"}
              </Button>

              <Button
                size="sm"
                variant="danger"
                disabled={busy}
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirm({ type: "delete", promo: p });
                }}
              >
                Delete
              </Button>
            </div>
          );
        },
      }),
    ];
  }, [navigate, busy]);

  const onConfirm = () => {
    if (!confirm?.promo?.id) return;

    const id = confirm.promo.id;

    if (confirm.type === "toggle") {
      const nextStatus = confirm.promo.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      toggleMut.mutate({ id, nextStatus });
    }

    if (confirm.type === "delete") {
      deleteMut.mutate(id);
    }
  };

  const confirmTitle =
    confirm?.type === "delete"
      ? "Delete promotion?"
      : confirm?.type === "toggle"
      ? confirm?.promo?.status === "ACTIVE"
        ? "Deactivate promotion?"
        : "Activate promotion?"
      : "";

  const confirmDesc =
    confirm?.type === "delete"
      ? "This will permanently remove the promotion and its target assignments. (Phase B uses delete, not archive.)"
      : confirm?.type === "toggle"
      ? "This changes whether the promotion is considered active (still not applied at checkout in Phase B)."
      : "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Promotions</h1>
          <p className="text-xs text-slate-500">
            Create promos and assign products/categories. No checkout price application yet.
          </p>
        </div>

        <Button variant="primary" onClick={() => navigate("/admin/products/promotions/create")}>
          + New Promotion
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
        ]}
      />

      {/* Data Table */}
      <DataTable
        title={null}
        subtitle={null}
        columns={columns}
        data={promos}
        isLoading={isLoading}
        error={isError ? true : null}
        emptyText="No promotions found."
        toolbar={{
          showSearch: true,
          searchPlaceholder: "Search promotion name or type…",
          showColumnToggle: true,
          showPageSize: false,
          rightSlot: (
            <Button variant="outline" onClick={refetch} disabled={busy}>
              Refresh
            </Button>
          ),
          // If your DataTable's toolbar can control search externally:
          // If it doesn't, this is harmless (DataTable ignores unknown fields)
          onSearchChange: (val) => {
            setSearch(val);
            setPage(1);
          },
          searchValue: search,
        }}
        onRowClick={(row) => navigate(`/admin/products/promotions/${row.id}/edit`)}
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
