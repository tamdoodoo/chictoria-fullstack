"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { formatPrice } from "@/lib/formatPrice";
import AccountLayout from "@/components/store/AccountLayout";
import { Package, Heart, MapPin, ShoppingBag, ArrowRight, Clock } from "@phosphor-icons/react";

const statusColors = {
  new: "bg-blue-100 text-blue-700",
  confirmed: "bg-purple-100 text-purple-700",
  packing: "bg-yellow-100 text-yellow-700",
  shipping: "bg-orange-100 text-orange-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-danger-bg text-danger",
};

function getGreeting(t) {
  const hour = new Date().getHours();
  if (hour < 12) return t("account_greeting_morning");
  if (hour < 18) return t("account_greeting_afternoon");
  return t("account_greeting_evening");
}

export default function AccountPage() {
  const { user, profile } = useAuth();
  const { t, lang } = useLang();
  const { addItem } = useCart();
  const { items: recentlyViewed } = useRecentlyViewed();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!profile?.phone) { setLoadingOrders(false); return; }
    fetch(`/api/orders?phone=${encodeURIComponent(profile.phone)}`)
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
  }, [profile]);

  const recentOrders = orders.slice(0, 3);
  const wishlistCount = profile?.wishlist?.length || 0;
  const addressCount = profile?.addresses?.length || 0;

  const getName = (item) => {
    if (typeof item.name === "object") return item.name[lang] || item.name.vi;
    return item.name;
  };

  const handleReorder = (order) => {
    order.items?.forEach((item) => {
      addItem({
        id: item.productId,
        name: item.name,
        price: item.price,
        images: [item.image],
      }, item.qty);
    });
  };

  return (
    <AccountLayout title={t("account_title")}>
      {/* Greeting */}
      <div className="bg-white rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-brown text-white flex items-center justify-center text-xl font-semibold shrink-0">
            {(profile?.name || user?.email || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-display text-brand-brown">
              {getGreeting(t)}, {profile?.name?.split(" ")[0] || "!"}
            </h2>
            <p className="text-sm text-text-muted mt-0.5">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Link href="/account/orders" className="bg-white rounded-2xl border border-border p-5 hover:border-brand-brown/30 transition-colors group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package size={20} />
            </div>
            <ArrowRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-2xl font-semibold text-text-primary">{orders.length}</p>
          <p className="text-xs text-text-muted mt-0.5">{t("account_stat_orders")}</p>
        </Link>

        <Link href="/account/wishlist" className="bg-white rounded-2xl border border-border p-5 hover:border-brand-brown/30 transition-colors group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-danger-bg text-danger flex items-center justify-center">
              <Heart size={20} />
            </div>
            <ArrowRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-2xl font-semibold text-text-primary">{wishlistCount}</p>
          <p className="text-xs text-text-muted mt-0.5">{t("account_stat_wishlist")}</p>
        </Link>

        <Link href="/account/addresses" className="bg-white rounded-2xl border border-border p-5 hover:border-brand-brown/30 transition-colors group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <ArrowRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-2xl font-semibold text-text-primary">{addressCount}</p>
          <p className="text-xs text-text-muted mt-0.5">{t("account_stat_addresses")}</p>
        </Link>
      </div>

      {/* Recently Viewed */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Clock size={16} className="text-text-muted" />
            {t("account_recently_viewed")}
          </h3>
          <Link href="/shop" className="text-xs text-brand-brown hover:underline">{t("account_browse")}</Link>
        </div>

        {recentlyViewed.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-text-muted">{t("account_no_recently_viewed")}</p>
          </div>
        ) : (
          <div className="p-4">
            <div className="flex gap-3 overflow-x-auto pb-1">
              {recentlyViewed.slice(0, 6).map((item) => (
                <Link key={item.id} href={`/product/${item.id}`} className="shrink-0 w-32 group">
                  <div className="aspect-square rounded-xl overflow-hidden bg-cream-dark mb-2">
                    <img src={item.image} alt={getName(item)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <p className="text-xs text-text-primary font-medium line-clamp-1 group-hover:text-brand-brown transition-colors">
                    {getName(item)}
                  </p>
                  <p className="text-xs text-brand-brown font-semibold mt-0.5">{formatPrice(item.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Package size={16} className="text-text-muted" />
            {t("account_recent_orders")}
          </h3>
          {orders.length > 0 && (
            <Link href="/account/orders" className="text-xs text-brand-brown hover:underline">
              {t("account_view_all_orders")}
            </Link>
          )}
        </div>

        {loadingOrders ? (
          <div className="px-6 py-10 text-center text-sm text-text-muted">Loading...</div>
        ) : recentOrders.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-text-muted mb-3">{t("account_no_orders")}</p>
            <Link href="/shop" className="text-sm text-brand-brown font-medium hover:underline">{t("cart_shop_now")}</Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-text-muted">{order.id.substring(0, 8)}...</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[order.status] || ""}`}>
                      {t(`admin_status_${order.status}`)}
                    </span>
                  </div>
                  <span className="text-xs text-text-muted">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {order.items?.slice(0, 3).map((item, i) => (
                        <img key={i} src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover border-2 border-white" />
                      ))}
                    </div>
                    <div className="ml-1">
                      <p className="text-sm font-medium text-text-primary">{formatPrice(order.totalPrice)}</p>
                      <p className="text-xs text-text-muted">{order.items?.length} {t("cart_items")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status === "completed" && (
                      <button
                        onClick={() => handleReorder(order)}
                        className="flex items-center gap-1.5 text-xs font-medium text-brand-brown bg-brand-brown/10 px-3 py-1.5 rounded-lg hover:bg-brand-brown/20 transition-colors"
                      >
                        <ShoppingBag size={12} /> {t("account_reorder")}
                      </button>
                    )}
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="text-xs text-text-muted hover:text-brand-brown transition-colors"
                    >
                      {t("account_view_order")} →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
