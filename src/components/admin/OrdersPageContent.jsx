"use client";

import { useLang } from "@/context/LanguageContext";
import OrdersList from "./OrdersList";

export default function OrdersPageContent({ orders, initialFilter }) {
  const { t } = useLang();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">{t("admin_orders")}</h1>
        <p className="text-sm text-gray-500 mt-1">{orders.length} {t("admin_orders").toLowerCase()}</p>
      </div>
      <OrdersList orders={orders} initialFilter={initialFilter} />
    </>
  );
}
