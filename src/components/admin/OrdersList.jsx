"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/formatPrice";
import OrderStatusBadge from "./OrderStatusBadge";

export default function OrdersList({ orders, initialFilter }) {
  const [filter, setFilter] = useState(initialFilter);
  const { t } = useLang();

  const statuses = [
    { id: "all", label: t("admin_status_all") },
    { id: "new", label: t("admin_status_new") },
    { id: "confirmed", label: t("admin_status_confirmed") },
    { id: "packing", label: t("admin_status_packing") },
    { id: "shipping", label: t("admin_status_shipping") },
    { id: "completed", label: t("admin_status_completed") },
    { id: "cancelled", label: t("admin_status_cancelled") },
  ];

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-6">
        {statuses.map((s) => (
          <button
            key={s.id}
            onClick={() => setFilter(s.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === s.id
                ? "bg-brand-brown text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s.label}
            {s.id !== "all" && (
              <span className="ml-1 opacity-60">
                ({orders.filter((o) => o.status === s.id).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{t("admin_col_order_id")}</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{t("admin_col_customer")}</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{t("admin_col_phone")}</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{t("admin_col_total")}</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{t("admin_col_payment")}</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{t("admin_col_status")}</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{t("admin_col_date")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-gray-400">
                  {t("admin_no_orders")}
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-mono text-brand-brown hover:underline">
                      {order.id.substring(0, 8)}...
                    </Link>
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-900">{order.customerName}</td>
                  <td className="px-5 py-3 text-gray-500">{order.phone}</td>
                  <td className="px-5 py-3 font-medium">{formatPrice(order.totalPrice)}</td>
                  <td className="px-5 py-3 text-xs">
                    {order.paymentMethod === "cod" ? "COD" : "CK"}{" "}
                    <span className={order.paymentStatus === "paid" ? "text-green-600" : "text-orange-500"}>
                      ({order.paymentStatus === "paid" ? t("admin_paid_label") : t("admin_unpaid_label")})
                    </span>
                  </td>
                  <td className="px-5 py-3"><OrderStatusBadge status={order.status} /></td>
                  <td className="px-5 py-3 text-gray-400">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
