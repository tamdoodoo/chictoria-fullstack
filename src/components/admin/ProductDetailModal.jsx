"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/formatPrice";

export default function ProductDetailModal({ product, onClose }) {
  const { t } = useLang();
  const router = useRouter();
  const [imgIndex, setImgIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const images = product.images || [];

  const handleDelete = async () => {
    if (!confirm(t("admin_delete_confirm"))) return;
    setDeleting(true);
    const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    if (res.ok) {
      onClose();
      router.refresh();
    } else {
      alert(t("admin_delete_failed"));
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-semibold text-gray-900 text-base truncate pr-4">
            {product.name?.vi || product.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none flex-shrink-0"
          >
            ×
          </button>
        </div>

        {/* Body — two columns */}
        <div className="flex overflow-hidden flex-1 min-h-0">

          {/* Left — images */}
          <div className="w-56 flex-shrink-0 p-4 flex flex-col gap-2 border-r border-gray-100">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50">
              {images.length > 0 ? (
                <Image
                  src={images[imgIndex]}
                  alt={product.name?.vi || ""}
                  fill
                  className="object-contain"
                  sizes="224px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No image</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex flex-wrap gap-1.5">
                {images.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`relative w-11 h-11 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                      i === imgIndex ? "border-brand-brown" : "border-gray-200"
                    }`}
                  >
                    <Image src={url} alt="" fill className="object-cover" sizes="44px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — details, scrollable */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm">

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-0.5">{t("admin_form_price")}</p>
                <p className="font-semibold text-gray-900">{formatPrice(product.price)}</p>
                {product.originalPrice && (
                  <p className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-0.5">{t("admin_col_stock")}</p>
                <p className={`font-semibold ${product.stock <= 5 ? "text-danger" : product.stock <= 15 ? "text-orange-500" : "text-green-600"}`}>
                  {product.stock}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-0.5">{t("admin_col_category")}</p>
                <p className="font-medium capitalize text-gray-900">{product.category}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-0.5">{t("admin_col_sold")}</p>
                <p className="font-medium text-gray-900">{product.sold || 0}</p>
              </div>
            </div>

            {/* Badges */}
            {(product.badge || product.featured || product.isNew) && (
              <div className="flex flex-wrap gap-1.5 text-xs">
                {product.badge && (
                  <span className="bg-brand-gold/10 text-brand-gold px-2 py-1 rounded-full font-medium">{product.badge}</span>
                )}
                {product.featured && (
                  <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">Featured</span>
                )}
                {product.isNew && (
                  <span className="bg-green-50 text-green-600 px-2 py-1 rounded-full font-medium">{t("admin_form_new_product")}</span>
                )}
              </div>
            )}

            {/* Description */}
            {(product.description?.vi || product.description?.en) && (
              <div className="space-y-1">
                <p className="font-medium text-gray-700">{t("admin_form_desc_vi")}</p>
                <p className="text-gray-600 leading-relaxed">{product.description?.vi}</p>
                {product.description?.en && (
                  <p className="text-gray-400 text-xs leading-relaxed">{product.description?.en}</p>
                )}
              </div>
            )}

            {/* Details */}
            {product.details?.vi?.length > 0 && (
              <div>
                <p className="font-medium text-gray-700 mb-1">{t("admin_form_details_vi")}</p>
                <ul className="space-y-0.5">
                  {product.details.vi.map((d, i) => (
                    <li key={i} className="text-gray-600 flex gap-2">
                      <span className="text-gray-300">•</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer — actions */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 text-center bg-red-50 text-danger px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            {deleting ? "…" : t("admin_delete")}
          </button>
          <Link
            href={`/admin/products/${product.id}`}
            className="flex-1 text-center bg-brand-brown text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-brown-light transition-colors"
          >
            {t("admin_edit")}
          </Link>
        </div>
      </div>
    </div>
  );
}
