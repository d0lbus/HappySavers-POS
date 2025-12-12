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
        alert("Failed to load categories");
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
     Handlers
  ------------------------- */
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setImageUploading(true);
    try {
      const res = await uploadProductImage(file);

      const payload = res.data?.data || {};
      handleChange("imageUrl", payload.url || "");
      handleChange("imageKey", payload.key || "");
    } catch (e) {
      console.error(e);
      alert("Image upload failed");
    } finally {
      setImageUploading(false);
    }
  };

  const canSubmit =
    form.name.trim() &&
    form.sku.trim() &&
    String(form.categoryId || "").trim() &&
    String(form.costPrice || "").trim() &&
    String(form.sellingPrice || "").trim() &&
    !loading &&
    !imageUploading;

  const handleSubmit = async () => {
    if (!canSubmit) return;

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
      alert("Failed to create product");
    } finally {
      setLoading(false);
    }
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
            />

            <InputField
              label="SKU"
              value={form.sku}
              onChange={(v) => handleChange("sku", v)}
              placeholder="Required, unique"
            />

            <InputField
              label="Barcode (optional)"
              value={form.barcode}
              onChange={(v) => handleChange("barcode", v)}
              placeholder="Optional for now"
            />

            <SelectField
              label="Category"
              value={String(form.categoryId || "")}
              onChange={(v) => handleChange("categoryId", v)}
              options={categoryOptions}
              helper={!categories.length ? "No categories loaded yet." : ""}
            />

            <InputField
              label="Cost Price"
              type="number"
              value={form.costPrice}
              onChange={(v) => handleChange("costPrice", v)}
              placeholder="0.00"
            />

            <InputField
              label="Selling Price"
              type="number"
              value={form.sellingPrice}
              onChange={(v) => handleChange("sellingPrice", v)}
              placeholder="0.00"
            />

            <InputField
              label="Low Stock Threshold"
              type="number"
              value={form.lowStockThreshold}
              onChange={(v) => handleChange("lowStockThreshold", v)}
              placeholder="0"
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
            <Button
              variant="outline"
              onClick={() => navigate("/admin/products")}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------
   Inputs (styled like UsersPage)
------------------------- */

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
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
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options, helper }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>

      <select
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {helper ? <p className="mt-1 text-xs text-slate-500">{helper}</p> : null}
    </div>
  );
}
