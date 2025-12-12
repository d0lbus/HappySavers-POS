import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getProductById, updateProduct } from "../../../api/products";
import { getCategories } from "../../../api/categories";
import { uploadProductImage } from "../../../api/uploads";

import Button from "../../../components/common/Button";

export default function ProductEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);

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

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setBanner(null);

      try {
        const [productRes, categoryRes] = await Promise.all([
          getProductById(id),
          getCategories(),
        ]);

        const product = productRes?.data?.data || null;
        const cats = Array.isArray(categoryRes?.data?.data)
          ? categoryRes.data.data
          : [];

        if (!alive) return;

        setCategories(cats);

        if (!product) {
          setBanner({ type: "error", message: "Product not found." });
          return;
        }

        // ✅ Map backend snake_case -> form camelCase
        setForm({
          name: product.name ?? "",
          sku: product.sku ?? "",
          barcode: product.barcode ?? "",
          categoryId: String(product.category_id ?? product.Category?.id ?? ""),
          costPrice: product.cost_price ?? "",
          sellingPrice: product.selling_price ?? "",
          lowStockThreshold: product.low_stock_threshold ?? "",
          isActive: Boolean(product.is_active),
          imageUrl: product.image_url ?? "",
          imageKey: product.image_key ?? "",
        });
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setBanner({ type: "error", message: "Failed to load product." });
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [id]);

  const categoryOptions = useMemo(() => {
    return [
      { value: "", label: "Select category" },
      ...categories.map((c) => ({
        value: String(c.id),
        label: c.name,
      })),
    ];
  }, [categories]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Product name is required.";
    if (!form.sku.trim()) e.sku = "SKU is required.";
    if (!String(form.categoryId || "").trim()) e.categoryId = "Category is required.";

    const cost = Number(form.costPrice);
    const sell = Number(form.sellingPrice);
    const low = Number(form.lowStockThreshold || 0);

    if (!Number.isFinite(cost) || cost < 0) e.costPrice = "Invalid cost price.";
    if (!Number.isFinite(sell) || sell < 0) e.sellingPrice = "Invalid selling price.";
    if (Number.isFinite(cost) && Number.isFinite(sell) && sell < cost) {
      e.sellingPrice = "Selling price cannot be lower than cost.";
    }
    if (!Number.isFinite(low) || low < 0) e.lowStockThreshold = "Invalid low stock threshold.";

    return e;
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    setImageUploading(true);
    setBanner(null);

    try {
      const res = await uploadProductImage(file);
      const payload = res?.data?.data || {};

      handleChange("imageUrl", payload.url || "");
      handleChange("imageKey", payload.key || "");
    } catch (e) {
      console.error(e);
      setBanner({ type: "error", message: "Image upload failed." });
    } finally {
      setImageUploading(false);
    }
  };

  const handleSave = async () => {
    const e = validate();
    setErrors(e);

    if (Object.keys(e).length) {
      setBanner({ type: "error", message: "Please fix the highlighted fields." });
      return;
    }

    setSaving(true);
    setBanner(null);

    try {
      await updateProduct(id, {
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
      const msg = e?.response?.data?.message || "Failed to update product.";
      setBanner({ type: "error", message: msg });

      if (msg.toLowerCase().includes("sku")) {
        setErrors((prev) => ({ ...prev, sku: msg }));
      }
    } finally {
      setSaving(false);
    }
  };

  const canSave = !saving && !imageUploading;

  if (loading) {
    return <div className="text-sm text-slate-500">Loading product…</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Edit Product</h1>
          <p className="text-sm text-slate-500">Update product details and availability.</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/products")}>
            Go back to Products List
          </Button>

          <Button variant="primary" onClick={handleSave} disabled={!canSave}>
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Banner */}
      {banner?.message ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {banner.message}
        </div>
      ) : null}

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Product Name"
              value={form.name}
              onChange={(v) => handleChange("name", v)}
              error={errors.name}
            />

            <InputField
              label="SKU"
              value={form.sku}
              onChange={(v) => handleChange("sku", v)}
              error={errors.sku}
            />

            <InputField
              label="Barcode"
              value={form.barcode}
              onChange={(v) => handleChange("barcode", v)}
            />

            <SelectField
              label="Category"
              value={String(form.categoryId || "")}
              onChange={(v) => handleChange("categoryId", v)}
              options={categoryOptions}
              error={errors.categoryId}
              helper={!categories.length ? "No categories loaded yet." : ""}
            />

            <InputField
              label="Cost Price"
              type="number"
              value={String(form.costPrice ?? "")}
              onChange={(v) => handleChange("costPrice", v)}
              error={errors.costPrice}
            />

            <InputField
              label="Selling Price"
              type="number"
              value={String(form.sellingPrice ?? "")}
              onChange={(v) => handleChange("sellingPrice", v)}
              error={errors.sellingPrice}
            />

            <InputField
              label="Low Stock Threshold"
              type="number"
              value={String(form.lowStockThreshold ?? "")}
              onChange={(v) => handleChange("lowStockThreshold", v)}
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

        {/* Image */}
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
                {imageUploading ? "Uploading…" : "Change Image"}
              </span>

              <span className="text-xs text-slate-500 truncate max-w-[180px]">
                {form.imageUrl ? "Uploaded" : "No image"}
              </span>
            </label>

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
                No image
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
   Inputs
------------------------- */

function InputField({ label, value, onChange, type = "text", error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200",
          error ? "border-red-300" : "border-slate-300",
        ].join(" ")}
      />

      {error ? <p className="text-xs text-red-600 mt-1">{error}</p> : null}
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
          "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200",
          error ? "border-red-300" : "border-slate-300",
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

      {error ? <p className="text-xs text-red-600 mt-1">{error}</p> : null}
      {helper ? <p className="mt-1 text-xs text-slate-500">{helper}</p> : null}
    </div>
  );
}
