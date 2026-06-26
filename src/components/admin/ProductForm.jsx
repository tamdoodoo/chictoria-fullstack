"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";
import Image from "next/image";

const selectClass = "w-full px-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b6b6b%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center]";
const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const cardClass = "bg-white border border-gray-200 rounded-xl p-4 space-y-3";

function Card({ title, children }) {
  return (
    <div className={cardClass}>
      {title && <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>}
      {children}
    </div>
  );
}

export default function ProductForm({ product = null }) {
  const isEdit = !!product;
  const router = useRouter();
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setCategories(data))
      .catch(() => {});
  }, []);

  const [form, setForm] = useState({
    id: product?.id || "",
    nameVi: product?.name?.vi || "",
    nameEn: product?.name?.en || "",
    price: product?.price || "",
    originalPrice: product?.originalPrice || "",
    category: product?.category || "",
    colorVi: product?.color?.vi || "",
    colorEn: product?.color?.en || "",
    descriptionVi: product?.description?.vi || "",
    descriptionEn: product?.description?.en || "",
    detailsVi: product?.details?.vi?.join("\n") || "",
    detailsEn: product?.details?.en?.join("\n") || "",
    images: product?.images || [],
    badge: product?.badge || "",
    stock: product?.stock ?? 50,
    featured: product?.featured ?? true,
    isNew: product?.isNew ?? false,
  });

  const set = (field) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: val });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setForm((prev) => ({ ...prev, images: [...prev.images, ...data.urls] }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.images.length === 0) {
      setError("Please upload at least one image before saving.");
      return;
    }

    setLoading(true);
    const body = {
      id: form.id || form.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: { vi: form.nameVi, en: form.nameEn },
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      category: form.category,
      color: { vi: form.colorVi, en: form.colorEn },
      description: { vi: form.descriptionVi, en: form.descriptionEn },
      details: {
        vi: form.detailsVi.split("\n").filter(Boolean),
        en: form.detailsEn.split("\n").filter(Boolean),
      },
      images: form.images,
      badge: form.badge || null,
      stock: Number(form.stock),
      featured: form.featured,
      isNew: form.isNew,
    };

    try {
      const url = isEdit ? `/api/products/${product.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-6 items-start">

        {/* ── Left column: content ── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Names */}
          <Card title="Product name">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>{t("admin_form_name_vi")} *</label>
                <input required value={form.nameVi} onChange={set("nameVi")} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t("admin_form_name_en")} *</label>
                <input required value={form.nameEn} onChange={set("nameEn")} className={inputClass} />
              </div>
            </div>
            {!isEdit && (
              <div>
                <label className={labelClass}>ID (slug)</label>
                <input value={form.id} onChange={set("id")} placeholder="Auto-generated from English name" className={inputClass} />
              </div>
            )}
          </Card>

          {/* Descriptions */}
          <Card title="Description">
            <div>
              <label className={labelClass}>{t("admin_form_desc_vi")}</label>
              <textarea rows={3} value={form.descriptionVi} onChange={set("descriptionVi")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t("admin_form_desc_en")}</label>
              <textarea rows={3} value={form.descriptionEn} onChange={set("descriptionEn")} className={inputClass} />
            </div>
          </Card>

          {/* Details */}
          <Card title="Details (one per line)">
            <div>
              <label className={labelClass}>{t("admin_form_details_vi")}</label>
              <textarea rows={5} value={form.detailsVi} onChange={set("detailsVi")} className={`${inputClass} font-mono`} />
            </div>
            <div>
              <label className={labelClass}>{t("admin_form_details_en")}</label>
              <textarea rows={5} value={form.detailsEn} onChange={set("detailsEn")} className={`${inputClass} font-mono`} />
            </div>
          </Card>
        </div>

        {/* ── Right column: metadata (sticky) ── */}
        <div className="w-72 flex-shrink-0 space-y-4 sticky top-6">

          {/* Images */}
          <Card title="Images">
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            {form.images.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {form.images.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                    <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" sizes="96px" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="aspect-square rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-gray-500 hover:text-gray-600 transition-colors disabled:opacity-50 text-xs gap-1"
                >
                  {uploading ? (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full py-8 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-gray-500 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
                  </svg>
                )}
                <span className="text-sm">{uploading ? "Uploading…" : "Upload images"}</span>
              </button>
            )}
          </Card>

          {/* Pricing */}
          <Card title="Pricing & stock">
            <div>
              <label className={labelClass}>{t("admin_form_price")} *</label>
              <input type="number" required value={form.price} onChange={set("price")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t("admin_form_original_price")}</label>
              <input type="number" value={form.originalPrice} onChange={set("originalPrice")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t("admin_form_stock")} *</label>
              <input type="number" required value={form.stock} onChange={set("stock")} className={inputClass} />
            </div>
          </Card>

          {/* Organisation */}
          <Card title="Organisation">
            <div>
              <label className={labelClass}>{t("admin_form_category")}</label>
              <select value={form.category} onChange={set("category")} className={selectClass}>
                {categories.length === 0 ? (
                  <option value={form.category}>{form.category || "Loading…"}</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nameEn} / {cat.nameVi}</option>
                  ))
                )}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass}>{t("admin_form_color_vi")}</label>
                <input value={form.colorVi} onChange={set("colorVi")} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t("admin_form_color_en")}</label>
                <input value={form.colorEn} onChange={set("colorEn")} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>{t("admin_form_badge")}</label>
              <select value={form.badge} onChange={set("badge")} className={selectClass}>
                <option value="">{t("admin_form_none")}</option>
                <option value="Bestseller">Bestseller</option>
                <option value="New">New</option>
                <option value="Sale">Sale</option>
              </select>
            </div>
          </Card>

          {/* Status */}
          <Card title="Status">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={set("featured")} className="accent-brand-brown w-4 h-4" />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.isNew} onChange={set("isNew")} className="accent-brand-brown w-4 h-4" />
              <span className="text-sm text-gray-700">{t("admin_form_new_product")}</span>
            </label>
          </Card>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-brown text-white py-2.5 rounded-lg text-sm font-medium hover:bg-brand-brown-light transition-colors disabled:opacity-50"
          >
            {loading ? t("admin_saving") : isEdit ? t("admin_update") : t("admin_create")}
          </button>
        </div>
      </div>
    </form>
  );
}
