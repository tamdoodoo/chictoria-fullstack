"use client";

import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import ProductForm from "./ProductForm";

export default function ProductFormPage({ product = null }) {
  const { t } = useLang();
  const isEdit = !!product;

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/admin/products" className="text-gray-400 hover:text-gray-600">← {t("admin_products")}</Link>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEdit ? t("admin_edit_product") : t("admin_new_product")}
        </h1>
      </div>
      <ProductForm product={product} />
    </>
  );
}
