"use client";

import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/formatPrice";
import OrderStatusBadge from "./OrderStatusBadge";
import CustomerDetailClient from "./CustomerDetailClient";

export default function CustomerDetailPage({ customer, orders }) {
  const { t } = useLang();

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/customers" className="text-gray-400 hover:text-gray-600">← {t("admin_customers")}</Link>
        <span className="text-gray-300">/</span>
        <span className="font-mono text-sm text-gray-600">{customer.phone}</span>
      </div>

      <div className="grid md:grid-cols-[1fr_350px] gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              {t("admin_customer_history")} ({orders.length})
            </h3>
            {orders.length === 0 ? (
              <p className="text-sm text-gray-400">{t("admin_customer_no_orders")}</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-mono text-xs text-gray-500">{order.id.substring(0, 12)}...</p>
                      <p className="text-sm font-medium mt-0.5">{formatPrice(order.totalPrice)}</p>
                    </div>
                    <div className="text-right">
                      <OrderStatusBadge status={order.status} />
                      <p className="text-xs text-gray-400 mt-1">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : "—"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t("admin_customer_info")}</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-400">{t("admin_col_name")}</p>
                <p className="font-medium text-gray-900">{customer.name}</p>
              </div>
              <div>
                <p className="text-gray-400">{t("admin_col_phone")}</p>
                <p className="font-mono text-gray-900">{customer.phone}</p>
              </div>
              <div>
                <p className="text-gray-400">{t("admin_col_total_orders")}</p>
                <p className="font-medium text-gray-900">{customer.totalOrders}</p>
              </div>
            </div>
          </div>

          <CustomerDetailClient customer={customer} />
        </div>
      </div>
    </div>
  );
}
