// src/pages/Admin/Products/PromotionCreatePage.jsx
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import api from "../../../api/client";

import Tabs from "../../../components/common/Tabs";
import Button from "../../../components/common/Button";
import Card, { CardHeader, CardTitle, CardSubtitle } from "../../../components/common/Card";

import TextInput from "../../../components/forms/TextInput";
import NumberInput from "../../../components/forms/NumberInput";
import SelectInput from "../../../components/forms/SelectInput";
import Toggle from "../../../components/forms/Toggle";
import DateRangePicker from "../../../components/forms/DateRangePicker";

import ToastContainer, { useToasts } from "../../../components/feedback/ToastContainer";

function toISODate(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function PromotionCreatePage() {
  const navigate = useNavigate();
  const { toasts, pushToast, removeToast } = useToasts();

  const [typeTab, setTypeTab] = useState("PERCENT"); // PERCENT | FIXED | BOGO | BUNDLE

  const [form, setForm] = useState({
    name: "",
    type: "PERCENT",
    value: "",
    status: true, // true=ACTIVE
    start_date: "",
    end_date: "",

    // BOGO fields
    bogo_buy_qty: "1",
    bogo_get_qty: "1",
    bogo_get_mode: "FREE", // FREE | PERCENT
    bogo_get_percent: "",

    // BUNDLE fields
    bundle_min_qty: "2",
    bundle_price: "",
  });

  const typeOptions = useMemo(
    () => [
      { label: "Percent", value: "PERCENT" },
      { label: "Fixed", value: "FIXED" },
      { label: "BOGO", value: "BOGO" },
      { label: "Bundle", value: "BUNDLE" },
    ],
    []
  );

  const onTypeChange = (nextType) => {
    setTypeTab(nextType);
    setForm((p) => ({
      ...p,
      type: nextType,
      value: nextType === "PERCENT" || nextType === "FIXED" ? p.value : "",
    }));
  };

  const createMut = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/promotions", payload);
      return res.data;
    },
    onSuccess: (created) => {
      pushToast({ type: "success", title: "Created", message: "Promotion created successfully." });
      // ✅ your actual route style
      navigate(`/admin/products/promotions/${created.id}/edit`);
    },
    onError: (err) => {
      pushToast({
        type: "error",
        title: "Failed",
        message: err?.response?.data?.message || err?.message || "Failed to create promotion.",
      });
    },
  });

  const busy = createMut.isPending;

  const validate = () => {
    if (!form.name.trim()) return "Promotion name is required.";

    if (form.type === "PERCENT") {
      const v = Number(form.value);
      if (form.value === "" || Number.isNaN(v)) return "Percent value must be a number.";
      if (v <= 0 || v > 100) return "Percent value must be between 1 and 100.";
    }

    if (form.type === "FIXED") {
      const v = Number(form.value);
      if (form.value === "" || Number.isNaN(v)) return "Fixed value must be a number.";
      if (v <= 0) return "Fixed value must be greater than 0.";
    }

    if (form.type === "BOGO") {
      const buy = Number(form.bogo_buy_qty);
      const get = Number(form.bogo_get_qty);
      if (Number.isNaN(buy) || buy <= 0) return "BOGO: Buy qty must be >= 1.";
      if (Number.isNaN(get) || get <= 0) return "BOGO: Get qty must be >= 1.";

      if (form.bogo_get_mode === "PERCENT") {
        const pct = Number(form.bogo_get_percent);
        if (form.bogo_get_percent === "" || Number.isNaN(pct)) return "BOGO: Get percent must be a number.";
        if (pct <= 0 || pct > 100) return "BOGO: Get percent must be between 1 and 100.";
      }
    }

    if (form.type === "BUNDLE") {
      const minQty = Number(form.bundle_min_qty);
      const price = Number(form.bundle_price);

      if (Number.isNaN(minQty) || minQty <= 1) return "Bundle: Min qty must be at least 2.";
      if (form.bundle_price === "" || Number.isNaN(price) || price <= 0) return "Bundle: Bundle price must be > 0.";
    }

    if (form.start_date && form.end_date) {
      const s = new Date(form.start_date);
      const e = new Date(form.end_date);
      if (!Number.isNaN(s.getTime()) && !Number.isNaN(e.getTime()) && e < s) {
        return "End date must be after start date.";
      }
    }

    return null;
  };

  const buildConfigJson = () => {
    if (form.type === "BOGO") {
      const buyQty = Number(form.bogo_buy_qty);
      const getQty = Number(form.bogo_get_qty);

      if (form.bogo_get_mode === "FREE") {
        return { buyQty, getQty, getMode: "FREE" };
      }

      return {
        buyQty,
        getQty,
        getMode: "PERCENT",
        getPercent: Number(form.bogo_get_percent),
      };
    }

    if (form.type === "BUNDLE") {
      return {
        minQty: Number(form.bundle_min_qty),
        bundlePrice: Number(form.bundle_price),
      };
    }

    return null;
  };

  const onSubmit = () => {
    const err = validate();
    if (err) {
      pushToast({ type: "warning", title: "Check fields", message: err });
      return;
    }

    const payload = {
      name: form.name.trim(),
      type: form.type,
      value:
        form.type === "PERCENT" || form.type === "FIXED"
          ? Number(form.value)
          : null,
      config_json: buildConfigJson(),
      start_date: form.start_date ? toISODate(form.start_date) : null,
      end_date: form.end_date ? toISODate(form.end_date) : null,
      status: form.status ? "ACTIVE" : "INACTIVE",
    };

    createMut.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Create Promotion</h1>
          <p className="text-xs text-slate-500">
            Phase B: Create promos and assign targets later. No checkout price application.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/products/promotions")}
            disabled={busy}
          >
            Back
          </Button>
          <Button variant="primary" onClick={onSubmit} disabled={busy}>
            {busy ? "Saving…" : "Create"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Promotion Details</CardTitle>
          <CardSubtitle>Choose promo type and basic settings</CardSubtitle>
        </CardHeader>

        <div className="p-5 space-y-5">
          <TextInput
            label="Promotion Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="e.g., 10% Off Snacks"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectInput
              label="Type"
              value={form.type}
              onChange={(e) => onTypeChange(e.target.value)}
              options={typeOptions}
              placeholder="Select type…"
              required
            />

            <Toggle
              label="Active"
              checked={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.checked }))}
              helperText={form.status ? "Promotion is active" : "Promotion is inactive"}
            />
          </div>

          <Tabs
            value={typeTab}
            onChange={onTypeChange}
            tabs={[
              { label: "Percent", value: "PERCENT" },
              { label: "Fixed", value: "FIXED" },
              { label: "BOGO", value: "BOGO" },
              { label: "Bundle", value: "BUNDLE" },
            ]}
          />

          {/* Percent */}
          {form.type === "PERCENT" ? (
            <NumberInput
              label="Percent Off"
              value={form.value}
              onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
              placeholder="e.g., 10"
              min={1}
              max={100}
              step="1"
              helperText="1 to 100"
              required
            />
          ) : null}

          {/* Fixed */}
          {form.type === "FIXED" ? (
            <NumberInput
              label="Amount Off"
              value={form.value}
              onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
              placeholder="e.g., 50"
              min={0}
              step="0.01"
              helperText="Peso amount to subtract (preview only in Phase B)"
              required
            />
          ) : null}

          {/* BOGO */}
          {form.type === "BOGO" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberInput
                  label="Buy Qty"
                  value={form.bogo_buy_qty}
                  onChange={(e) => setForm((p) => ({ ...p, bogo_buy_qty: e.target.value }))}
                  min={1}
                  step="1"
                  required
                />
                <NumberInput
                  label="Get Qty"
                  value={form.bogo_get_qty}
                  onChange={(e) => setForm((p) => ({ ...p, bogo_get_qty: e.target.value }))}
                  min={1}
                  step="1"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectInput
                  label="Get Mode"
                  value={form.bogo_get_mode}
                  onChange={(e) => setForm((p) => ({ ...p, bogo_get_mode: e.target.value }))}
                  options={[
                    { label: "Free", value: "FREE" },
                    { label: "Percent Off", value: "PERCENT" },
                  ]}
                />

                {form.bogo_get_mode === "PERCENT" ? (
                  <NumberInput
                    label="Get Percent"
                    value={form.bogo_get_percent}
                    onChange={(e) => setForm((p) => ({ ...p, bogo_get_percent: e.target.value }))}
                    min={1}
                    max={100}
                    step="1"
                    required
                  />
                ) : (
                  <div />
                )}
              </div>
            </div>
          ) : null}

          {/* Bundle */}
          {form.type === "BUNDLE" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberInput
                  label="Min Qty"
                  value={form.bundle_min_qty}
                  onChange={(e) => setForm((p) => ({ ...p, bundle_min_qty: e.target.value }))}
                  min={2}
                  step="1"
                  required
                />
                <NumberInput
                  label="Bundle Price"
                  value={form.bundle_price}
                  onChange={(e) => setForm((p) => ({ ...p, bundle_price: e.target.value }))}
                  min={0}
                  step="0.01"
                  required
                />
              </div>
            </div>
          ) : null}

          <DateRangePicker
            label="Schedule (optional)"
            startValue={form.start_date}
            endValue={form.end_date}
            onStartChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))}
            onEndChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))}
            helperText="Leave blank to allow anytime"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/products/promotions")}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={onSubmit} disabled={busy}>
              {busy ? "Saving…" : "Create Promotion"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
