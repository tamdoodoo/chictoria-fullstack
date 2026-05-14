"use client";

import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/formatPrice";
import AccountLayout from "./AccountLayout";

const statusColors = {
  new: "bg-blue-100 text-blue-700",
  confirmed: "bg-purple-100 text-purple-700",
  packing: "bg-yellow-100 text-yellow-700",
  shipping: "bg-orange-100 text-orange-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-danger-bg text-danger",
};

const carrierNames = {
  ghn: "Giao Hàng Nhanh",
  ghtk: "Giao Hàng Tiết Kiệm",
  jt: "J&T Express",
  viettel: "Viettel Post",
  spx: "Shopee Express",
  other: "Other",
};

const carrierTrackingUrls = {
  ghn: (code) => `https://donhang.ghn.vn/?order_code=${code}`,
  ghtk: (code) => `https://i.ghtk.vn/${code}`,
  jt: (code) => `https://jtexpress.vn/vi/tracking?type=track&billcode=${code}`,
  viettel: (code) => `https://viettelpost.com.vn/tra-cuu-hanh-trinh-don/?waybill=${code}`,
  spx: (code) => `https://spx.vn/tracking?code=${code}`,
};

const statusSteps = ["new", "confirmed", "packing", "shipping", "completed"];

export default function UserOrderDetailWrapper({ order }) {
  const { t } = useLang();

  const currentStep = statusSteps.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <AccountLayout title={t("account_title")}>
      {/* Order Tracking Header */}
      <div className="bg-white rounded-2xl border border-border p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-text-muted font-mono mb-1">{order.id}</p>
            <h2 className="text-base font-semibold text-text-primary">{t("account_order_tracking")}</h2>
          </div>
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusColors[order.status]}`}>
            {t(`admin_status_${order.status}`)}
          </span>
        </div>

        {/* Status Timeline */}
        {!isCancelled && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              {statusSteps.map((step, i) => (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                      i <= currentStep ? "bg-brand-brown text-white" : "bg-gray-100 text-gray-400"
                    }`}>
                      {i < currentStep ? "✓" : i + 1}
                    </div>
                    <span className={`text-[10px] mt-1.5 text-center ${i <= currentStep ? "text-brand-brown font-medium" : "text-text-muted"}`}>
                      {t(`admin_status_${step}`)}
                    </span>
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1.5 ${i < currentStep ? "bg-brand-brown" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Shipping Tracking */}
      {order.trackingNumber && (order.status === "shipping" || order.status === "completed") && (
        <div className="bg-white rounded-2xl border border-border p-6 mb-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">{t("order_tracking_title")}</h3>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1 text-sm">
              <div className="flex gap-2">
                <span className="text-text-muted">{t("order_tracking_carrier")}:</span>
                <span className="font-medium text-text-primary">{carrierNames[order.shippingCarrier] || order.shippingCarrier}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-text-muted">{t("order_tracking_number")}:</span>
                <span className="font-mono font-medium text-text-primary">{order.trackingNumber}</span>
              </div>
            </div>
            {carrierTrackingUrls[order.shippingCarrier] && (
              <a
                href={carrierTrackingUrls[order.shippingCarrier](order.trackingNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1 bg-brand-brown text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-brand-brown-light transition-colors"
              >
                {t("order_track_button")} →
              </a>
            )}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden mb-4">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-text-primary">{t("admin_order_items")}</h3>
        </div>
        <div className="divide-y divide-border">
          {order.items?.map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              {item.image && (
                <img src={item.image} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">{item.name}</p>
                <p className="text-xs text-text-muted">x{item.qty}</p>
              </div>
              <p className="text-sm font-medium text-text-primary shrink-0">{formatPrice(item.price * item.qty)}</p>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-border space-y-2 text-sm">
          <div className="flex justify-between text-text-muted">
            <span>{t("cart_shipping")}</span>
            <span>{order.shippingFee === 0 ? t("cart_shipping_free") : formatPrice(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between font-semibold text-brand-brown text-base">
            <span>{t("cart_total")}</span>
            <span>{formatPrice(order.totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">{t("checkout_info")}</h3>
        <div className="divide-y divide-border text-sm">
          <div className="flex justify-between py-2.5">
            <span className="text-text-muted">{t("checkout_name")}</span>
            <span className="text-text-primary font-medium">{order.customerName}</span>
          </div>
          <div className="flex justify-between py-2.5">
            <span className="text-text-muted">{t("checkout_phone")}</span>
            <span className="text-text-primary font-mono">{order.phone}</span>
          </div>
          <div className="flex justify-between py-2.5">
            <span className="text-text-muted">{t("checkout_address")}</span>
            <span className="text-text-primary text-right max-w-[60%]">{order.address}</span>
          </div>
          <div className="flex justify-between py-2.5">
            <span className="text-text-muted">{t("checkout_payment")}</span>
            <span className="text-text-primary">{order.paymentMethod === "cod" ? "COD" : t("checkout_bank")}</span>
          </div>
          {order.note && (
            <div className="flex justify-between py-2.5">
              <span className="text-text-muted">{t("checkout_note")}</span>
              <span className="text-text-primary text-right max-w-[60%]">{order.note}</span>
            </div>
          )}
        </div>
      </div>
    </AccountLayout>
  );
}
