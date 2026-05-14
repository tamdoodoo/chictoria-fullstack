"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/formatPrice";
import OrderStatusBadge from "./OrderStatusBadge";

const transitions = {
  new: ["confirmed", "cancelled"],
  confirmed: ["packing", "cancelled"],
  packing: ["shipping", "cancelled"],
  shipping: ["completed"],
  completed: [],
  cancelled: [],
};

const actionKeys = {
  confirmed: "admin_action_confirm",
  packing: "admin_action_packing",
  shipping: "admin_action_shipping",
  completed: "admin_action_complete",
  cancelled: "admin_action_cancel",
};

const carriers = [
  { value: "ghn", labelKey: "admin_carrier_ghn" },
  { value: "ghtk", labelKey: "admin_carrier_ghtk" },
  { value: "jt", labelKey: "admin_carrier_jt" },
  { value: "viettel", labelKey: "admin_carrier_viettel" },
  { value: "spx", labelKey: "admin_carrier_spx" },
  { value: "other", labelKey: "admin_carrier_other" },
];

const carrierTrackingUrls = {
  ghn: (code) => `https://donhang.ghn.vn/?order_code=${code}`,
  ghtk: (code) => `https://i.ghtk.vn/${code}`,
  jt: (code) => `https://jtexpress.vn/vi/tracking?type=track&billcode=${code}`,
  viettel: (code) => `https://viettelpost.com.vn/tra-cuu-hanh-trinh-don/?waybill=${code}`,
  spx: (code) => `https://spx.vn/tracking?code=${code}`,
};

export default function OrderDetailClient({ order: initialOrder }) {
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(false);
  const [showShipModal, setShowShipModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [shippingCarrier, setShippingCarrier] = useState(order.shippingCarrier || "ghn");
  const [trackingSaving, setTrackingSaving] = useState(false);
  const router = useRouter();
  const { t } = useLang();

  const handleStatusChange = async (newStatus) => {
    if (newStatus === "cancelled" && !confirm(t("admin_order_confirm_cancel"))) return;

    // If moving to shipping, show modal to enter tracking info
    if (newStatus === "shipping") {
      setShowShipModal(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrder({ ...order, status: newStatus });
        router.refresh();
      }
    } catch {
      alert(t("admin_order_update_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleShipConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "shipping",
          trackingNumber: trackingNumber.trim(),
          shippingCarrier,
        }),
      });
      if (res.ok) {
        setOrder({ ...order, status: "shipping", trackingNumber: trackingNumber.trim(), shippingCarrier });
        setShowShipModal(false);
        router.refresh();
      }
    } catch {
      alert(t("admin_order_update_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTracking = async () => {
    setTrackingSaving(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackingNumber: trackingNumber.trim(),
          shippingCarrier,
        }),
      });
      if (res.ok) {
        setOrder({ ...order, trackingNumber: trackingNumber.trim(), shippingCarrier });
        router.refresh();
      }
    } catch {
      alert(t("admin_order_update_failed"));
    } finally {
      setTrackingSaving(false);
    }
  };

  const handlePaymentToggle = async () => {
    const newStatus = order.paymentStatus === "paid" ? "pending" : "paid";
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });
      if (res.ok) {
        setOrder({ ...order, paymentStatus: newStatus });
      }
    } catch {
      alert(t("admin_order_update_failed"));
    } finally {
      setLoading(false);
    }
  };

  const nextStatuses = transitions[order.status] || [];
  const carrierLabel = carriers.find((c) => c.value === order.shippingCarrier)?.labelKey;
  const trackingUrl = order.trackingNumber && carrierTrackingUrls[order.shippingCarrier]
    ? carrierTrackingUrls[order.shippingCarrier](order.trackingNumber)
    : null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/orders" className="text-gray-400 hover:text-gray-600">← {t("admin_orders")}</Link>
        <span className="text-gray-300">/</span>
        <span className="font-mono text-sm text-gray-600">{order.id}</span>
      </div>

      <div className="grid md:grid-cols-[1fr_350px] gap-6">
        <div className="space-y-6">
          {/* Status + Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">{t("admin_order_status")}</p>
                <OrderStatusBadge status={order.status} />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">{t("admin_order_payment")}</p>
                <button
                  onClick={handlePaymentToggle}
                  disabled={loading}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {order.paymentStatus === "paid" ? t("admin_order_paid") + " ✓" : t("admin_order_unpaid")}
                </button>
              </div>
            </div>

            {nextStatuses.length > 0 && (
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                {nextStatuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                      s === "cancelled"
                        ? "bg-danger-bg text-danger hover:bg-danger-bg"
                        : "bg-brand-brown text-white hover:bg-brand-brown-light"
                    }`}
                  >
                    → {t(actionKeys[s])}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Shipping Tracking — show when status is shipping or completed */}
          {(order.status === "shipping" || order.status === "completed") && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">{t("admin_shipping_info")}</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">{t("admin_shipping_carrier")}</label>
                  <select
                    value={shippingCarrier}
                    onChange={(e) => setShippingCarrier(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-brand-brown transition-colors"
                  >
                    {carriers.map((c) => (
                      <option key={c.value} value={c.value}>{t(c.labelKey)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">{t("admin_tracking_number")}</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder={t("admin_tracking_placeholder")}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono outline-none focus:border-brand-brown transition-colors"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveTracking}
                  disabled={trackingSaving}
                  className="px-4 py-2 bg-brand-brown text-white rounded-lg text-sm font-medium hover:bg-brand-brown-light transition-colors disabled:opacity-50"
                >
                  {trackingSaving ? "..." : t("admin_save_tracking")}
                </button>
                {trackingUrl && (
                  <a
                    href={trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand-brown hover:underline"
                  >
                    {t("order_track_button")} →
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t("admin_order_items")}</h3>
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  {item.image && (
                    <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-400">x{item.qty} · {formatPrice(item.price)}</p>
                  </div>
                  <p className="text-sm font-medium">{formatPrice(item.price * item.qty)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>{t("admin_order_shipping_fee")}</span>
                <span>{order.shippingFee === 0 ? t("admin_order_free") : formatPrice(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-gray-900">
                <span>{t("admin_order_total")}</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          {order.note && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">{t("admin_order_note")}</h3>
              <p className="text-sm text-gray-600">{order.note}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t("admin_order_customer")}</h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-gray-900">{order.customerName}</p>
              <p className="text-gray-500">{order.phone}</p>
              <p className="text-gray-500">{order.address}</p>
            </div>
            <Link
              href={`/admin/customers/${order.phone}`}
              className="block text-sm text-brand-brown hover:underline mt-3"
            >
              {t("admin_order_view_profile")}
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t("admin_order_details")}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">{t("admin_order_id")}</span>
                <span className="font-mono text-xs">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t("admin_order_payment_method")}</span>
                <span>{order.paymentMethod === "cod" ? t("admin_order_cod") : t("admin_order_bank")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t("admin_order_created")}</span>
                <span>{order.createdAt ? new Date(order.createdAt).toLocaleString("vi-VN") : "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ship Confirmation Modal */}
      {showShipModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{t("admin_ship_confirm_title")}</h3>
            <p className="text-sm text-gray-500 mb-5">{t("admin_ship_confirm_desc")}</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("admin_shipping_carrier")}</label>
                <select
                  value={shippingCarrier}
                  onChange={(e) => setShippingCarrier(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-brown transition-colors"
                >
                  {carriers.map((c) => (
                    <option key={c.value} value={c.value}>{t(c.labelKey)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("admin_tracking_number")}</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder={t("admin_tracking_placeholder")}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono outline-none focus:border-brand-brown transition-colors"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowShipModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleShipConfirm}
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-brand-brown text-white rounded-xl text-sm font-medium hover:bg-brand-brown-light transition-colors disabled:opacity-50"
              >
                {loading ? "..." : `→ ${t(actionKeys.shipping)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
