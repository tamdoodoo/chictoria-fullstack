"use client";

import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/formatPrice";
import ProductDeleteButton from "./ProductDeleteButton";

export default function ProductsPageContent({ products }) {
  const { t } = useLang();

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{t("admin_products")}</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} {t("admin_products").toLowerCase()}</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-brand-brown text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-brown-light transition-colors"
        >
          {t("admin_add_product")}
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{t("admin_products")}</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{t("admin_col_total")}</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{t("admin_col_stock")}</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{t("admin_col_category")}</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{t("admin_col_sold")}</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{t("admin_col_actions")}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images?.[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium text-gray-900">{p.name?.vi || p.name}</p>
                      {p.badge && <span className="text-xs text-brand-gold">{p.badge}</span>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 font-medium">{formatPrice(p.price)}</td>
                <td className="px-5 py-3">
                  <span className={`font-medium ${p.stock <= 5 ? "text-danger" : p.stock <= 15 ? "text-orange-500" : "text-green-600"}`}>
                    {p.stock}
                  </span>
                  {p.stock <= 5 && <span className="text-xs text-danger-light ml-1 font-semibold">! {t("admin_low_stock")}</span>}
                </td>
                <td className="px-5 py-3 text-gray-500 capitalize">{p.category}</td>
                <td className="px-5 py-3 text-gray-500">{p.sold || 0}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/products/${p.id}`} className="text-brand-brown hover:underline text-xs">{t("admin_edit")}</Link>
                    <ProductDeleteButton productId={p.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
