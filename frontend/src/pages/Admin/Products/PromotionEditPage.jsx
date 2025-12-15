// src/pages/Admin/Products/PromotionEditPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../../api/client";

import Tabs from "../../../components/common/Tabs";
import Button from "../../../components/common/Button";
import Card, {
  CardHeader,
  CardTitle,
  CardSubtitle,
} from "../../../components/common/Card";

import TextInput from "../../../components/forms/TextInput";
import NumberInput from "../../../components/forms/NumberInput";
import SelectInput from "../../../components/forms/SelectInput";
import Toggle from "../../../components/forms/Toggle";
import DateRangePicker from "../../../components/forms/DateRangePicker";
import SearchBar from "../../../components/forms/SearchBar";

import SlideOverPanel from "../../../components/modals/SlideOverPanel";
import ConfirmDialog from "../../../components/modals/ConfirmDialog";

import ToastContainer, {
  useToasts,
} from "../../../components/feedback/ToastContainer";
import LoadingSpinner from "../../../components/feedback/LoadingSpinner";
import EmptyState from "../../../components/feedback/EmptyState";

function toISODate(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function normalizeListResponse(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
}

function normalizeConfig(config) {
  if (!config || typeof config !== "object") return {};
  return config;
}

export default function PromotionEditPage() {
  const { id } = useParams();
  const promoId = Number(id);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { toasts, pushToast, removeToast } = useToasts();

  const [typeTab, setTypeTab] = useState("PERCENT");

  const [form, setForm] = useState({
    name: "",
    type: "PERCENT",
    value: "",
    status: false,
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

  // Targets UI state
  const [openProducts, setOpenProducts] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);

  const [prodSearch, setProdSearch] = useState("");
  const [catSearch, setCatSearch] = useState("");

  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  const [confirmDelete, setConfirmDelete] = useState(false);

  const typeOptions = useMemo(
    () => [
      { label: "Percent", value: "PERCENT" },
      { label: "Fixed", value: "FIXED" },
      { label: "BOGO", value: "BOGO" },
      { label: "Bundle", value: "BUNDLE" },
    ],
    []
  );

  const promoQuery = useQuery({
    queryKey: ["promotion", promoId],
    queryFn: async () => {
      const res = await api.get(`/promotions/${promoId}`);
      return res.data;
    },
    enabled: Number.isFinite(promoId) && promoId > 0,
  });

  const productsQuery = useQuery({
    queryKey: ["promo-products-pick", { q: prodSearch }],
    queryFn: async () => {
      const res = await api.get("/products", {
        params: {
          q: prodSearch,
          limit: 100,
          status: "active",
          sortBy: "name",
          sortDir: "asc",
        },
      });
      return normalizeListResponse(res.data);
    },
    enabled: openProducts,
    keepPreviousData: true,
  });

  const categoriesQuery = useQuery({
    queryKey: ["promo-categories-pick", { q: catSearch }],
    queryFn: async () => {
      const res = await api.get("/categories", {
        params: { q: catSearch, limit: 200, sortBy: "name", sortDir: "asc" },
      });
      return normalizeListResponse(res.data);
    },
    enabled: openCategories,
    keepPreviousData: true,
  });

  // Initialize form from fetched promo
  useEffect(() => {
    const p = promoQuery.data;
    if (!p) return;

    const statusActive = p.status === "ACTIVE";
    const type = p.type || "PERCENT";
    const cfg = normalizeConfig(p.config_json);

    setTypeTab(type);

    setForm((prev) => {
      const next = {
        ...prev,
        name: p.name || "",
        type,
        value: p.value ?? "",
        status: statusActive,
        start_date: p.start_date ? toISODate(p.start_date) : "",
        end_date: p.end_date ? toISODate(p.end_date) : "",
      };

      // Fill structured config fields based on type
      if (type === "BOGO") {
        const buyQty = cfg.buyQty ?? 1;
        const getQty = cfg.getQty ?? 1;
        const getMode = cfg.getMode === "PERCENT" ? "PERCENT" : "FREE";
        const getPercent =
          getMode === "PERCENT" && cfg.getPercent != null
            ? String(cfg.getPercent)
            : "";

        return {
          ...next,
          bogo_buy_qty: String(buyQty),
          bogo_get_qty: String(getQty),
          bogo_get_mode: getMode,
          bogo_get_percent: getPercent,
        };
      }

      if (type === "BUNDLE") {
        const minQty = cfg.minQty ?? 2;
        const bundlePrice =
          cfg.bundlePrice != null ? String(cfg.bundlePrice) : "";

        return {
          ...next,
          bundle_min_qty: String(minQty),
          bundle_price: bundlePrice,
        };
      }

      return next;
    });

    const prodIds = Array.isArray(p.products) ? p.products.map((x) => x.id) : [];
    const catIds = Array.isArray(p.categories)
      ? p.categories.map((x) => x.id)
      : [];

    setSelectedProductIds(prodIds);
    setSelectedCategoryIds(catIds);
  }, [promoQuery.data]);

  const onTypeChange = (nextType) => {
    setTypeTab(nextType);
    setForm((p) => ({
      ...p,
      type: nextType,
      value: nextType === "PERCENT" || nextType === "FIXED" ? p.value : "",
    }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Promotion name is required.";

    if (form.type === "PERCENT") {
      const v = Number(form.value);
      if (form.value === "" || Number.isNaN(v))
        return "Percent value must be a number.";
      if (v <= 0 || v > 100) return "Percent value must be between 1 and 100.";
    }

    if (form.type === "FIXED") {
      const v = Number(form.value);
      if (form.value === "" || Number.isNaN(v))
        return "Fixed value must be a number.";
      if (v <= 0) return "Fixed value must be greater than 0.";
    }

    if (form.type === "BOGO") {
      const buy = Number(form.bogo_buy_qty);
      const get = Number(form.bogo_get_qty);
      if (Number.isNaN(buy) || buy <= 0) return "BOGO: Buy qty must be >= 1.";
      if (Number.isNaN(get) || get <= 0) return "BOGO: Get qty must be >= 1.";

      if (form.bogo_get_mode === "PERCENT") {
        const pct = Number(form.bogo_get_percent);
        if (form.bogo_get_percent === "" || Number.isNaN(pct))
          return "BOGO: Get percent must be a number.";
        if (pct <= 0 || pct > 100)
          return "BOGO: Get percent must be between 1 and 100.";
      }
    }

    if (form.type === "BUNDLE") {
      const minQty = Number(form.bundle_min_qty);
      const price = Number(form.bundle_price);
      if (Number.isNaN(minQty) || minQty <= 1)
        return "Bundle: Min qty must be at least 2.";
      if (form.bundle_price === "" || Number.isNaN(price) || price <= 0)
        return "Bundle: Bundle price must be > 0.";
    }

    if (form.start_date && form.end_date) {
      const s = new Date(form.start_date);
      const e = new Date(form.end_date);
      if (
        !Number.isNaN(s.getTime()) &&
        !Number.isNaN(e.getTime()) &&
        e < s
      ) {
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

  const updateMut = useMutation({
    mutationFn: async (payload) => {
      const res = await api.put(`/promotions/${promoId}`, payload);
      return res.data;
    },
    onSuccess: async () => {
      pushToast({ type: "success", title: "Saved", message: "Promotion updated." });
      await qc.invalidateQueries({ queryKey: ["promotion", promoId] });
      await qc.invalidateQueries({ queryKey: ["promotions"] });
    },
    onError: (err) => {
      pushToast({
        type: "error",
        title: "Failed",
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to update promotion.",
      });
    },
  });

  const deleteMut = useMutation({
    mutationFn: async () => {
      const res = await api.delete(`/promotions/${promoId}`);
      return res.data;
    },
    onSuccess: async () => {
      pushToast({ type: "success", title: "Deleted", message: "Promotion deleted." });
      await qc.invalidateQueries({ queryKey: ["promotions"] });
      navigate("/admin/products/promotions");
    },
    onError: (err) => {
      pushToast({
        type: "error",
        title: "Failed",
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to delete promotion.",
      });
    },
  });

  const setProductsMut = useMutation({
    mutationFn: async (productIds) => {
      const res = await api.post(`/promotions/${promoId}/products`, { productIds });
      return res.data;
    },
    onSuccess: async () => {
      pushToast({ type: "success", title: "Updated", message: "Products updated." });
      setOpenProducts(false);
      await qc.invalidateQueries({ queryKey: ["promotion", promoId] });
      await qc.invalidateQueries({ queryKey: ["promotions"] });
    },
    onError: (err) => {
      pushToast({
        type: "error",
        title: "Failed",
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to update products.",
      });
    },
  });

  const setCategoriesMut = useMutation({
    mutationFn: async (categoryIds) => {
      const res = await api.post(`/promotions/${promoId}/categories`, { categoryIds });
      return res.data;
    },
    onSuccess: async () => {
      pushToast({ type: "success", title: "Updated", message: "Categories updated." });
      setOpenCategories(false);
      await qc.invalidateQueries({ queryKey: ["promotion", promoId] });
      await qc.invalidateQueries({ queryKey: ["promotions"] });
    },
    onError: (err) => {
      pushToast({
        type: "error",
        title: "Failed",
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to update categories.",
      });
    },
  });

  const busy =
    promoQuery.isLoading ||
    updateMut.isPending ||
    deleteMut.isPending ||
    setProductsMut.isPending ||
    setCategoriesMut.isPending;

  const onSave = () => {
    const err = validate();
    if (err) {
      pushToast({ type: "warning", title: "Check fields", message: err });
      return;
    }

    const payload = {
      name: form.name.trim(),
      type: form.type,
      value:
        form.type === "PERCENT" || form.type === "FIXED" ? Number(form.value) : null,
      config_json: buildConfigJson(),
      start_date: form.start_date ? toISODate(form.start_date) : null,
      end_date: form.end_date ? toISODate(form.end_date) : null,
      status: form.status ? "ACTIVE" : "INACTIVE",
    };

    updateMut.mutate(payload);
  };

  const promo = promoQuery.data;

  const assignedProductsText = useMemo(() => {
    const list = Array.isArray(promo?.products) ? promo.products : [];
    if (!list.length) return "None";
    if (list.length <= 3) return list.map((p) => p.name).join(", ");
    return `${list.slice(0, 3).map((p) => p.name).join(", ")} +${list.length - 3} more`;
  }, [promo?.products]);

  const assignedCategoriesText = useMemo(() => {
    const list = Array.isArray(promo?.categories) ? promo.categories : [];
    if (!list.length) return "None";
    if (list.length <= 3) return list.map((c) => c.name).join(", ");
    return `${list.slice(0, 3).map((c) => c.name).join(", ")} +${list.length - 3} more`;
  }, [promo?.categories]);

  if (promoQuery.isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSpinner label="Loading promotion…" />
      </div>
    );
  }

  if (promoQuery.isError || !promo) {
    return (
      <div className="space-y-6">
        <EmptyState
          title="Promotion not found"
          description="The promotion may have been deleted or you don’t have access."
          actionLabel="Back to Promotions"
          onAction={() => navigate("/admin/products/promotions")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Edit Promotion</h1>
          <p className="text-xs text-slate-500">
            Phase B: You can assign products/categories and preview later. No checkout application yet.
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
          <Button
            variant="outline"
            onClick={() => setConfirmDelete(true)}
            disabled={busy}
          >
            Delete
          </Button>
          <Button variant="primary" onClick={onSave} disabled={busy}>
            {updateMut.isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Promotion Details</CardTitle>
          <CardSubtitle>Update fields and status</CardSubtitle>
        </CardHeader>

        <div className="p-5 space-y-5">
          <TextInput
            label="Promotion Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
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
              min={1}
              max={100}
              step="1"
              required
            />
          ) : null}

          {/* Fixed */}
          {form.type === "FIXED" ? (
            <NumberInput
              label="Amount Off"
              value={form.value}
              onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
              min={0}
              step="0.01"
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
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Assigned Products</CardTitle>
            <CardSubtitle>{assignedProductsText}</CardSubtitle>
          </CardHeader>
          <div className="p-5">
            <Button variant="outline" onClick={() => setOpenProducts(true)} disabled={busy}>
              Manage Products
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Categories</CardTitle>
            <CardSubtitle>{assignedCategoriesText}</CardSubtitle>
          </CardHeader>
          <div className="p-5">
            <Button variant="outline" onClick={() => setOpenCategories(true)} disabled={busy}>
              Manage Categories
            </Button>
          </div>
        </Card>
      </div>

      {/* Products Panel */}
      <SlideOverPanel
        open={openProducts}
        onClose={() => setOpenProducts(false)}
        title="Select Products"
        subtitle="These products will be targeted by this promotion (Phase B storage only)."
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenProducts(false)}
              disabled={setProductsMut.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => setProductsMut.mutate(selectedProductIds)}
              disabled={setProductsMut.isPending}
            >
              {setProductsMut.isPending ? "Saving…" : "Save Products"}
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <SearchBar
            value={prodSearch}
            onChange={(e) => setProdSearch(e.target.value)}
            onClear={() => setProdSearch("")}
            placeholder="Search products…"
          />

          {productsQuery.isLoading ? <LoadingSpinner label="Loading products…" /> : null}

          {productsQuery.isError ? (
            <div className="text-sm text-rose-600">Failed to load products.</div>
          ) : null}

          {!productsQuery.isLoading && !productsQuery.isError ? (
            <div className="space-y-2">
              {(productsQuery.data || []).map((p) => {
                const checked = selectedProductIds.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">{p.name}</div>
                      <div className="text-xs text-slate-500 truncate">
                        SKU: {p.sku || "-"} • ₱{Number(p.selling_price ?? 0).toFixed(2)}
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const on = e.target.checked;
                        setSelectedProductIds((prev) => {
                          if (on) return Array.from(new Set([...prev, p.id]));
                          return prev.filter((x) => x !== p.id);
                        });
                      }}
                      className="h-4 w-4"
                    />
                  </label>
                );
              })}
            </div>
          ) : null}
        </div>
      </SlideOverPanel>

      {/* Categories Panel */}
      <SlideOverPanel
        open={openCategories}
        onClose={() => setOpenCategories(false)}
        title="Select Categories"
        subtitle="These categories will be targeted by this promotion (Phase B storage only)."
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenCategories(false)}
              disabled={setCategoriesMut.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => setCategoriesMut.mutate(selectedCategoryIds)}
              disabled={setCategoriesMut.isPending}
            >
              {setCategoriesMut.isPending ? "Saving…" : "Save Categories"}
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <SearchBar
            value={catSearch}
            onChange={(e) => setCatSearch(e.target.value)}
            onClear={() => setCatSearch("")}
            placeholder="Search categories…"
          />

          {categoriesQuery.isLoading ? <LoadingSpinner label="Loading categories…" /> : null}

          {categoriesQuery.isError ? (
            <div className="text-sm text-rose-600">Failed to load categories.</div>
          ) : null}

          {!categoriesQuery.isLoading && !categoriesQuery.isError ? (
            <div className="space-y-2">
              {(categoriesQuery.data || []).map((c) => {
                const checked = selectedCategoryIds.includes(c.id);
                return (
                  <label
                    key={c.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">{c.name}</div>
                    </div>

                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const on = e.target.checked;
                        setSelectedCategoryIds((prev) => {
                          if (on) return Array.from(new Set([...prev, c.id]));
                          return prev.filter((x) => x !== c.id);
                        });
                      }}
                      className="h-4 w-4"
                    />
                  </label>
                );
              })}
            </div>
          ) : null}
        </div>
      </SlideOverPanel>

      {/* Delete confirm */}
      <ConfirmDialog
        open={confirmDelete}
        title="Delete promotion?"
        description="This will permanently remove the promotion and its target assignments."
        confirmText="Delete"
        variant="danger"
        loading={deleteMut.isPending}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => deleteMut.mutate()}
      />
    </div>
  );
}
