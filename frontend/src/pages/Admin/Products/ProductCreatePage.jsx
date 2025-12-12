import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createProduct } from "../../../api/products";
import { getCategories } from "../../../api/categories";
import { uploadProductImage } from "../../../api/uploads";

import Button from "../../../components/common/Button";

export default function ProductCreatePage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null); // { type: 'error'|'success', message }
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    barcode: "",
    categoryId: "",
    costPrice: "",
    sellingPrice: "",
    lowStockThreshold: "",
    isActive: true,
    imageUrl: "",
    imageKey: "",
  });

  /* -------------------------
     Load categories
  ------------------------- */
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await getCategories();
        const rows = Array.isArray(res.data?.data) ? res.data.data : [];
        setCategories(rows);
      } catch (e) {
        console.error(e);
        setBanner({ type: "error", message: "Failed to load categories." });
      }
    }
    loadCategories();
  }, []);

  const categoryOptions = useMemo(() => {
    return [
      { value: "", label: "Select category" },
      ...categories.map((c) => ({
        value: String(c.id),
        label: c.name,
      })),
    ];
  }, [categories]);

  /* -------------------------
     Helpers
  ------------------------- */
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    // clear inline error on change
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  function validate(f) {
    const e = {};

    if (!f.name.trim()) e.name = "Product name is required.";
    if (!f.sku.trim()) e.sku = "SKU is required.";
    if (!String(f.categoryId || "").trim()) e.categoryId = "Category is required.";

    const cost = Number(f.costPrice);
    const sell = Number(f.sellingPrice);
    const low = Number(f.lowStockThreshold || 0);

    if (!String(f.costPrice).trim()) e.costPrice = "Cost price is required.";
    else if (!Number.isFinite(cost) || cost < 0) e.costPrice = "Cost price must be 0 or higher.";

    if (!String(f.sellingPrice).trim()) e.sellingPrice = "Selling price is required.";
    else if (!Number.isFinite(sell) || sell < 0) e.sellingPrice = "Selling price must be 0 or higher.";

    if (!Number.isFinite(low) || low < 0) e.lowStockThreshold = "Low stock threshold must be 0 or higher.";

    if (Number.isFinite(cost) && Number.isFinite(sell) && String(f.costPrice).trim() && String(f.sellingPrice).trim()) {
      if (sell < cost) e.sellingPrice = "Selling price should not be lower than cost price.";
    }

    return e;
  }

  const canSubmit = useMemo(() => {
    const e = validate(form);
    return Object.keys(e).length === 0 && !loading && !imageUploading;
  }, [form, loading, imageUploading]);

  /* -------------------------
     Image upload
  ------------------------- */
  const handleImageUpload = async (file) => {
    if (!file) return;

    setImageUploading(true);
    setBanner(null);

    try {
      const res = await uploadProductImage(file);

      // upload controller returns: { data: { url, key, ... } }
      const payload = res.data?.data || {};
      handleChange("imageUrl", payload.url || "");
      handleChange("imageKey", payload.key || "");
    } catch (e) {
      console.error(e);
      setBanner({ type: "error", message: "Image upload failed." });
    } finally {
      setImageUploading(false);
    }
  };

  /* -------------------------
     Submit
  ------------------------- */
  const handleSubmit = async () => {
    setBanner(null);

    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length) {
      setBanner({ type: "error", message: "Please fix the highlighted fields." });
      return;
    }

    setLoading(true);

    try {
      await createProduct({
        name: form.name.trim(),
        sku: form.sku.trim(),
        barcode: form.barcode.trim() ? form.barcode.trim() : null,
        categoryId: Number(form.categoryId),
        costPrice: Number(form.costPrice),
        sellingPrice: Number(form.sellingPrice),
        lowStockThreshold: Number(form.lowStockThreshold || 0),
        isActive: Boolean(form.isActive),
        imageUrl: form.imageUrl || null,
        imageKey: form.imageKey || null,
      });

      navigate("/admin/products");
    } catch (e) {
      console.error(e);

      const status = e?.response?.status;
      const msg = e?.response?.data?.message || "Failed to create product.";

      // Duplicate/constraint mapping (SKU most important)
      if (status === 409 || status === 422) {
        const lowMsg = String(msg).toLowerCase();

        if (lowMsg.includes("sku")) {
          setErrors((prev) => ({ ...prev, sku: msg }));
          setBanner({ type: "error", message: "SKU already exists. Please use a different one." });
          return;
        }

        if (lowMsg.includes("barcode")) {
          setErrors((prev) => ({ ...prev, barcode: msg }));
          setBanner({ type: "error", message: "Barcode issue. Please check the value." });
          return;
        }
      }

      setBanner({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  const confirmCancel = () => {
    // if form is empty, go back immediately
    const hasAnyValue =
      form.name.trim() ||
      form.sku.trim() ||
      form.barcode.trim() ||
      String(form.categoryId || "").trim() ||
      String(form.costPrice || "").trim() ||
      String(form.sellingPrice || "").trim() ||
      String(form.lowStockThreshold || "").trim() ||
      form.imageUrl;

    if (!hasAnyValue) {
      navigate("/admin/products");
      return;
    }

    setShowCancelConfirm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Add Product</h1>
          <p className="text-sm text-slate-500">
            Create a new product for the selling screen and inventory tracking later.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/products")}>
            Back
          </Button>

          <Button variant="primary" onClick={handleSubmit} disabled={!canSubmit}>
            {loading ? "Saving…" : "Save Product"}
          </Button>
        </div>
      </div>

      {/* Banner */}
      {banner ? (
        <div
          className={[
            "rounded-lg border px-4 py-3 text-sm",
            banner.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700",
          ].join(" ")}
        >
          {banner.message}
        </div>
      ) : null}

      {/* Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Product Name"
              value={form.name}
              onChange={(v) => handleChange("name", v)}
              placeholder="e.g., Coke 1.5L"
              error={errors.name}
            />

            <InputField
              label="SKU"
              value={form.sku}
              onChange={(v) => handleChange("sku", v)}
              placeholder="Required, unique"
              error={errors.sku}
              helper="Format: CATEGORY-PRODUCT-VARIANT"
            />

            <InputField
              label="Barcode (optional)"
              value={form.barcode}
              onChange={(v) => handleChange("barcode", v)}
              placeholder="Optional for now"
              error={errors.barcode}
            />

            <SelectField
              label="Category"
              value={String(form.categoryId || "")}
              onChange={(v) => handleChange("categoryId", v)}
              options={categoryOptions}
              helper={!categories.length ? "No categories loaded yet." : ""}
              error={errors.categoryId}
            />

            <InputField
              label="Cost Price"
              type="number"
              value={form.costPrice}
              onChange={(v) => handleChange("costPrice", v)}
              placeholder="0.00"
              error={errors.costPrice}
            />

            <InputField
              label="Selling Price"
              type="number"
              value={form.sellingPrice}
              onChange={(v) => handleChange("sellingPrice", v)}
              placeholder="0.00"
              error={errors.sellingPrice}
            />

            <InputField
              label="Low Stock Threshold"
              type="number"
              value={form.lowStockThreshold}
              onChange={(v) => handleChange("lowStockThreshold", v)}
              placeholder="0"
              error={errors.lowStockThreshold}
            />
          </div>

          {/* Status */}
          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <p className="text-sm font-medium text-slate-900">Product Status</p>
              <p className="text-xs text-slate-500">
                Inactive products are hidden from cashier selling screen.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={[
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                  form.isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-200 text-slate-700",
                ].join(" ")}
              >
                {form.isActive ? "ACTIVE" : "INACTIVE"}
              </span>

              <button
                type="button"
                onClick={() => handleChange("isActive", !form.isActive)}
                className={[
                  "relative inline-flex h-7 w-12 items-center rounded-full transition",
                  form.isActive ? "bg-emerald-500" : "bg-slate-300",
                ].join(" ")}
                aria-pressed={form.isActive}
                aria-label="Toggle active status"
              >
                <span
                  className={[
                    "inline-block h-5 w-5 transform rounded-full bg-white transition",
                    form.isActive ? "translate-x-6" : "translate-x-1",
                  ].join(" ")}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Side Card: Image */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Product Image</h2>
            <p className="text-xs text-slate-500">
              Upload an image for product listing and future POS display.
            </p>
          </div>

          <div className="space-y-2">
            <label className="inline-flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e.target.files?.[0])}
              />

              <span className="px-3 py-2 text-sm rounded-lg border bg-white cursor-pointer">
                Choose Image
              </span>

              <span className="text-xs text-slate-500 truncate max-w-[180px]">
                {form.imageUrl ? "Uploaded" : "No file uploaded"}
              </span>
            </label>

            {imageUploading ? (
              <p className="text-xs text-slate-500">Uploading image…</p>
            ) : null}

            {form.imageUrl ? (
              <div className="border rounded-lg p-2">
                <img
                  src={form.imageUrl}
                  alt="preview"
                  className="w-full h-44 object-contain"
                />
              </div>
            ) : (
              <div className="border border-dashed rounded-lg h-44 flex items-center justify-center text-xs text-slate-400">
                No image uploaded
              </div>
            )}
          </div>

          <div className="pt-2 border-t">
            <Button variant="outline" onClick={confirmCancel} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Cancel Confirm Modal */}
      {showCancelConfirm ? (
        <ConfirmModal
          title="Discard changes?"
          description="You have unsaved changes. If you leave now, they will be lost."
          confirmText="Discard"
          cancelText="Stay"
          onCancel={() => setShowCancelConfirm(false)}
          onConfirm={() => navigate("/admin/products")}
        />
      ) : null}
    </div>
  );
}

/* -------------------------
   Reusable Inputs (inline errors)
------------------------- */

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  error,
  helper,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2",
          error
            ? "border-red-300 focus:ring-red-200"
            : "border-slate-300 focus:ring-emerald-200",
        ].join(" ")}
      />

      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : helper ? (
        <p className="mt-1 text-xs text-slate-500">{helper}</p>
      ) : null}
    </div>
  );
}

function SelectField({ label, value, onChange, options, helper, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>

      <select
        className={[
          "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2",
          error
            ? "border-red-300 focus:ring-red-200"
            : "border-slate-300 focus:ring-emerald-200",
        ].join(" ")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : helper ? (
        <p className="mt-1 text-xs text-slate-500">{helper}</p>
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
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 border border-slate-200">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-600">{description}</p>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
