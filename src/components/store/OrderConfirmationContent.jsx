"use client";

import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/formatPrice";

export default function OrderConfirmationContent({ order }) {
  const { t } = useLang();

  return (
    <main className="pt-20 md:pt-[72px]">
      <div className="max-w-2xl mx-auto px-5 py-16 text-center">
        <h1 className="font-display text-3xl text-brand-brown mb-3">
          {t("order_success")}
        </h1>
        <p className="text-text-secondary mb-8">{t("order_thank")}</p>

        <div className="bg-white rounded-2xl p-6 border border-border text-left mb-8">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
            <span className="text-sm text-text-muted">{t("order_id")}</span>
            <span className="text-sm font-mono font-semibold text-text-primary">
              {order.id}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-text-secondary">
                  {item.name} x{item.qty}
                </span>
                <span className="text-text-primary font-medium">
                  {formatPrice(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-3 space-y-2">
            <div className="flex justify-between text-sm text-text-secondary">
              <span>{t("cart_shipping")}</span>
              <span>
                {order.shippingFee === 0
                  ? t("cart_shipping_free")
                  : formatPrice(order.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-semibold text-brand-brown">
              <span>{t("cart_total")}</span>
              <span>{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Bank transfer info */}
        {order.paymentMethod === "bank_transfer" && (
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 text-left mb-8">
            <h3 className="text-sm font-semibold text-brand-brown mb-4">
              {t("order_bank_info")}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">{t("order_bank_name")}</span>
                <span className="font-medium">Vietcombank</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">{t("order_bank_account")}</span>
                <span className="font-mono font-medium">1234567890</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">{t("order_bank_holder")}</span>
                <span className="font-medium">CHICTORIA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">{t("order_bank_content")}</span>
                <span className="font-mono font-medium text-brand-brown">
                  DH {order.id.substring(0, 8).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-brand-brown text-white px-7 py-3 rounded-full text-sm font-medium hover:bg-brand-brown-light transition-colors"
        >
          {t("order_back_home")}
        </Link>
      </div>
    </main>
  );
}
