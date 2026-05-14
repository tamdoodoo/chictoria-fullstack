"use client";

import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/formatPrice";
import DashboardStats from "./DashboardStats";
import OrderStatusBadge from "./OrderStatusBadge";

export default function DashboardContent({ todayOrders, allOrders }) {
  const { t } = useLang();

  const todayRevenue = todayOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const pendingCount = allOrders.filter((o) => o.status === "new").length;
  const recentOrders = allOrders.slice(0, 10);

  const monthlyRevenue = allOrders
    .filter((o) => {
      if (o.status === "cancelled") return false;
      const d = o.createdAt ? new Date(o.createdAt) : null;
      if (!d) return false;
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">{t("admin_dashboard")}</p>
      </div>

      <DashboardStats
        todayCount={todayOrders.length}
        todayRevenue={formatPrice(todayRevenue)}
        pendingCount={pendingCount}
        monthlyRevenue={formatPrice(monthlyRevenue)}
      />

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">{t("admin_recent_orders")}</h2>
          <Link href="/admin/orders" className="text-sm text-brand-brown hover:underline">
            {t("admin_view_all")}
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{t("admin_col_order_id")}</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{t("admin_col_customer")}</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{t("admin_col_total")}</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{t("admin_col_status")}</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{t("admin_col_date")}</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-400">
                    {t("admin_no_orders")}
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="font-mono text-brand-brown hover:underline">
                        {order.id.substring(0, 8)}...
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{order.customerName}</p>
                        <p className="text-xs text-gray-400">{order.phone}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-medium">{formatPrice(order.totalPrice)}</td>
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
    </>
  );
}
