"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/formatPrice";
import AccountLayout from "@/components/store/AccountLayout";
import { Package } from "@phosphor-icons/react";

const statusColors = {
  new: "bg-blue-100 text-blue-700",
  confirmed: "bg-purple-100 text-purple-700",
  packing: "bg-yellow-100 text-yellow-700",
  shipping: "bg-orange-100 text-orange-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-danger-bg text-danger",
};

export default function UserOrdersPage() {
  const { profile, loading: authLoading } = useAuth();
  const { t } = useLang();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!profile?.phone) { setLoading(false); return; }

    fetch(`/api/orders?phone=${encodeURIComponent(profile.phone)}`)
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [profile, authLoading]);

  return (
    <AccountLayout title={t("account_title")}>
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-text-primary">{t("account_orders")}</h2>
        </div>

        {loading ? (
          <div className="px-6 py-16 text-center text-text-muted text-sm">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Package size={40} className="mx-auto text-text-muted mb-3 opacity-30" />
            <p className="text-text-muted mb-4 text-sm">{t("account_no_orders")}</p>
            <Link href="/shop" className="text-sm text-brand-brown font-medium hover:underline">{t("cart_shop_now")}</Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-cream-dark transition-colors"
              >
                <div className="flex -space-x-2 shrink-0">
                  {order.items?.slice(0, 3).map((item, i) => (
                    <img key={i} src={item.image} alt="" className="w-11 h-11 rounded-lg object-cover border-2 border-white" />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-xs text-text-muted">{order.id.substring(0, 8)}...</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[order.status] || ""}`}>
                      {t(`admin_status_${order.status}`)}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted">
                    {order.items?.length} {t("cart_items")} · {order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : "—"}
                  </p>
                </div>
                <span className="text-sm font-semibold text-brand-brown shrink-0">{formatPrice(order.totalPrice)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
