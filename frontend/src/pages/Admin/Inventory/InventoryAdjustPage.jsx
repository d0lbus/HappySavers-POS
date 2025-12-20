import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adjustInventory, getInventory } from "../../../api/inventory";

import Button from "../../../components/common/Button";
import TextInput from "../../../components/forms/TextInput";
import NumberInput from "../../../components/forms/NumberInput";
import SelectInput from "../../../components/forms/SelectInput";

function toInt(v) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : 0;
}

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function InventoryAdjustPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const qc = useQueryClient();

  const preselectedId = location?.state?.productId ?? "";

  const [productId, setProductId] = useState(preselectedId ? String(preselectedId) : "");
  const [direction, setDirection] = useState("IN");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [confirm, setConfirm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => getInventory().then((res) => res.data),
  });

  const products = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const selected = useMemo(() => {
    return products.find((p) => String(p.id) === String(productId));
  }, [products, productId]);

  const before = toNum(selected?.current_stock);
  const th = toNum(selected?.low_stock_threshold);

  const previewAfter = useMemo(() => {
    const qty = toInt(quantity);
    if (!qty) return before;
    return direction === "IN" ? before + qty : before - qty;
  }, [before, direction, quantity]);

  const mut = useMutation({
    mutationFn: (payload) => adjustInventory(payload),
    onSuccess: async () => {
      setConfirm(false);
      await qc.invalidateQueries({ queryKey: ["inventory"] });
      await qc.invalidateQueries({ queryKey: ["inventory-movements"] });
      await qc.invalidateQueries({ queryKey: ["inventory-low-stock"] });
      navigate("/admin/inventory");
    },
  });

  const busy = mut.isPending;

  const submitDisabled = useMemo(() => {
    const pid = toInt(productId);
    const qty = toInt(quantity);
    if (!pid || pid <= 0) return true;
    if (!["IN", "OUT"].includes(direction)) return true;
    if (!qty || qty <= 0) return true;
    return busy;
  }, [productId, quantity, direction, busy]);

  const onSubmit = (e) => {
    e.preventDefault();
    setConfirm(true);
  };

  const onConfirm = () => {
    const pid = toInt(productId);
    const qty = toInt(quantity);

    mut.mutate({
      product_id: pid,
      direction,
      quantity: qty,
      movement_type: "ADJUST",
      reason: reason.trim() ? reason.trim() : null,
      notes: notes.trim() ? notes.trim() : null,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">
          Inventory Adjustment
        </h1>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/inventory")}>
            Back
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/admin/inventory/movements")}
          >
            Movements
          </Button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        {mut.isError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
            {mut.error?.response?.data?.message || mut.error?.message || "Adjustment failed."}
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectInput
            label="Product"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            disabled={isLoading || busy}
            options={[
              { label: "Select product…", value: "" },
              ...products.map((p) => ({
                label: `${p.name} (${p.sku || "No SKU"})`,
                value: String(p.id),
              })),
            ]}
          />

          <SelectInput
            label="Direction"
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            disabled={busy}
            options={[
              { label: "IN (Add stock)", value: "IN" },
              { label: "OUT (Remove stock)", value: "OUT" },
            ]}
          />

          <NumberInput
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(toInt(e.target.value))}
            min={1}
            step={1}
            disabled={busy}
          />

          <TextInput
            label="Reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., recount, damage, correction"
            disabled={busy}
          />
        </div>

        <TextInput
          label="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Extra details…"
          disabled={busy}
        />

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <div>
              <span className="text-slate-500">Current stock:</span>{" "}
              <span className="font-semibold">{selected ? before : "—"}</span>
            </div>
            <div>
              <span className="text-slate-500">Threshold:</span>{" "}
              <span className="font-semibold">{selected ? th : "—"}</span>
            </div>
            <div>
              <span className="text-slate-500">After adjustment:</span>{" "}
              <span className="font-semibold">{selected ? previewAfter : "—"}</span>
            </div>
          </div>

          {selected && direction === "OUT" && previewAfter < 0 ? (
            <div className="mt-2 text-red-700">
              This would go negative. Backend will block it.
            </div>
          ) : null}
        </div>

        <div className="flex gap-2">
          <Button type="submit" variant="primary" disabled={submitDisabled}>
            {busy ? "Saving…" : "Save Adjustment"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/inventory")}
            disabled={busy}
          >
            Cancel
          </Button>
        </div>
      </form>

      {/* Confirm Modal */}
      {confirm ? (
        <ConfirmModal
          title="Save adjustment?"
          description="This will create a stock movement and write to audit logs."
          confirmText={busy ? "Working…" : "Confirm"}
          cancelText="Cancel"
          onCancel={() => setConfirm(false)}
          onConfirm={onConfirm}
          disabled={busy}
        />
      ) : null}
    </div>
  );
}

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
