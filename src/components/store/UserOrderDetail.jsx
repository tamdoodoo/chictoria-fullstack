"use client";

import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/formatPrice";

const statusColors = {
  new: "bg-blue-100 text-blue-700",
  confirmed: "bg-purple-100 text-purple-700",
  packing: "bg-yellow-100 text-yellow-700",
  shipping: "bg-orange-100 text-orange-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-danger-bg text-danger",
};

const statusSteps = ["new", "confirmed", "packing", "shipping", "completed"];

export default function UserOrderDetail({ order }) {
  const { t } = useLang();

  const currentStep = statusSteps.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <main className="pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-5">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/account/orders" className="text-text-muted hover:text-text-secondary">← {t("account_orders")}</Link>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl text-brand-brown">{t("account_order_tracking")}</h1>
            <p className="text-xs text-text-muted font-mono mt-1">{order.id}</p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusColors[order.status]}`}>
            {t(`admin_status_${order.status}`)}
          </span>
        </div>

        {/* Status Timeline */}
        {!isCancelled && (
          <div className="bg-white rounded-2xl border border-border p-6 mb-6">
            <div className="flex items-center justify-between">
              {statusSteps.map((step, i) => (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                      i <= currentStep ? "bg-brand-brown text-white" : "bg-gray-100 text-gray-400"
                    }`}>
                      {i < currentStep ? "✓" : i + 1}
                    </div>
                    <span className={`text-[10px] mt-1.5 ${i <= currentStep ? "text-brand-brown font-medium" : "text-text-muted"}`}>
                      {t(`admin_status_${step}`)}
                    </span>
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${i < currentStep ? "bg-brand-brown" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Items */}
        <div className="bg-white rounded-2xl border border-border p-6 mb-6">
          <div className="space-y-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                {item.image && (
                  <img src={item.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">{item.name}</p>
                  <p className="text-xs text-text-muted">x{item.qty}</p>
                </div>
                <p className="text-sm font-medium text-text-primary">{formatPrice(item.price * item.qty)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-border mt-5 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-text-muted">
              <span>{t("cart_subtotal")}</span>
              <span>{formatPrice(order.totalPrice - (order.shippingFee || 0))}</span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>{t("cart_shipping")}</span>
              <span>{order.shippingFee === 0 ? t("cart_shipping_free") : formatPrice(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between font-semibold text-brand-brown text-base pt-2 border-t border-border">
              <span>{t("cart_total")}</span>
              <span>{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">{t("checkout_name")}</span>
              <span className="text-text-primary font-medium">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">{t("checkout_phone")}</span>
              <span className="text-text-primary font-mono">{order.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">{t("checkout_address")}</span>
              <span className="text-text-primary text-right max-w-[60%]">{order.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">{t("checkout_payment")}</span>
              <span className="text-text-primary">{order.paymentMethod === "cod" ? "COD" : t("checkout_bank")}</span>
            </div>
            {order.note && (
              <div className="flex justify-between">
                <span className="text-text-muted">{t("checkout_note")}</span>
                <span className="text-text-primary text-right max-w-[60%]">{order.note}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
