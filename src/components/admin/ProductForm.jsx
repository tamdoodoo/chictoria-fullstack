"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";

export default function ProductForm({ product = null }) {
  const isEdit = !!product;
  const router = useRouter();
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    id: product?.id || "",
    nameVi: product?.name?.vi || "",
    nameEn: product?.name?.en || "",
    price: product?.price || "",
    originalPrice: product?.originalPrice || "",
    category: product?.category || "tote",
    colorVi: product?.color?.vi || "",
    colorEn: product?.color?.en || "",
    descriptionVi: product?.description?.vi || "",
    descriptionEn: product?.description?.en || "",
    detailsVi: product?.details?.vi?.join("\n") || "",
    detailsEn: product?.details?.en?.join("\n") || "",
    images: product?.images?.join("\n") || "",
    badge: product?.badge || "",
    stock: product?.stock ?? 50,
    featured: product?.featured ?? true,
    isNew: product?.isNew ?? false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
      images: form.images.split("\n").filter(Boolean),
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

  const set = (field) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: val });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin_form_name_vi")} *</label>
          <input required value={form.nameVi} onChange={set("nameVi")} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin_form_name_en")} *</label>
          <input required value={form.nameEn} onChange={set("nameEn")} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
      </div>

      {!isEdit && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ID (slug)</label>
          <input value={form.id} onChange={set("id")} placeholder="Auto-generated from English name" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin_form_price")} *</label>
          <input type="number" required value={form.price} onChange={set("price")} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin_form_original_price")}</label>
          <input type="number" value={form.originalPrice} onChange={set("originalPrice")} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin_form_stock")} *</label>
          <input type="number" required value={form.stock} onChange={set("stock")} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin_form_category")}</label>
          <select value={form.category} onChange={set("category")} className="w-full px-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b6b6b%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center]">
            <option value="tote">Tote</option>
            <option value="hobo">Hobo</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin_form_color_vi")}</label>
          <input value={form.colorVi} onChange={set("colorVi")} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin_form_color_en")}</label>
          <input value={form.colorEn} onChange={set("colorEn")} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin_form_desc_vi")}</label>
        <textarea rows={3} value={form.descriptionVi} onChange={set("descriptionVi")} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin_form_desc_en")}</label>
        <textarea rows={3} value={form.descriptionEn} onChange={set("descriptionEn")} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin_form_details_vi")}</label>
        <textarea rows={4} value={form.detailsVi} onChange={set("detailsVi")} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin_form_details_en")}</label>
        <textarea rows={4} value={form.detailsEn} onChange={set("detailsEn")} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin_form_images")}</label>
        <textarea rows={3} value={form.images} onChange={set("images")} placeholder="/images/SKU1-1.jpg" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin_form_badge")}</label>
          <select value={form.badge} onChange={set("badge")} className="w-full px-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b6b6b%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center]">
            <option value="">{t("admin_form_none")}</option>
            <option value="Bestseller">Bestseller</option>
            <option value="New">New</option>
            <option value="Sale">Sale</option>
          </select>
        </div>
        <label className="flex items-center gap-2 pt-6">
          <input type="checkbox" checked={form.featured} onChange={set("featured")} className="accent-brand-brown" />
          <span className="text-sm text-gray-700">Featured</span>
        </label>
        <label className="flex items-center gap-2 pt-6">
          <input type="checkbox" checked={form.isNew} onChange={set("isNew")} className="accent-brand-brown" />
          <span className="text-sm text-gray-700">{t("admin_form_new_product")}</span>
        </label>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-brand-brown text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-brown-light transition-colors disabled:opacity-50"
      >
        {loading ? t("admin_saving") : isEdit ? t("admin_update") : t("admin_create")}
      </button>
    </form>
  );
}
