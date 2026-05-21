"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/formatPrice";
import { X, ShoppingBag } from "@phosphor-icons/react";

export default function CartDrawer() {
  const { items, removeItem, updateQty, totalPrice, drawerOpen, closeDrawer } = useCart();
  const { t, lang } = useLang();
  const shipping = totalPrice >= 500000 ? 0 : 30000;
  const total = totalPrice + shipping;

  const getName = (item) => {
    if (typeof item.name === "object") return item.name[lang] || item.name.vi;
    return item.name;
  };

  // Lock body scroll when open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-cream z-50 shadow-2xl flex flex-col rounded-l-[32px] transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="font-display text-lg text-brand-brown">
            {t("cart_title")} ({items.reduce((s, i) => s + i.qty, 0)})
          </h2>
          <button
            onClick={closeDrawer}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-cream-dark transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <ShoppingBag size={48} className="text-text-muted/30 mb-4" />
            <p className="font-display text-lg text-brand-brown mb-2">{t("cart_empty_title")}</p>
            <p className="text-sm text-text-secondary mb-6">{t("cart_empty_desc")}</p>
            <button
              onClick={closeDrawer}
              className="text-sm font-medium text-brand-brown underline hover:no-underline"
            >
              {t("cart_continue")}
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-0 divide-y divide-border">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 py-4">
                    <Link
                      href={`/product/${item.id}`}
                      onClick={closeDrawer}
                      className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-cream-dark"
                    >
                      <img src={item.image} alt={getName(item)} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.id}`}
                        onClick={closeDrawer}
                        className="text-sm font-medium text-text-primary hover:text-brand-brown transition-colors line-clamp-1"
                      >
                        {getName(item)}
                      </Link>
                      <p className="text-sm font-semibold text-brand-brown mt-1">{formatPrice(item.price * item.qty)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-border rounded-lg overflow-hidden">
                          <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 flex items-center justify-center text-text-muted hover:bg-cream-dark text-xs">−</button>
                          <span className="w-7 h-7 flex items-center justify-center text-xs font-semibold">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 flex items-center justify-center text-text-muted hover:bg-cream-dark text-xs">+</button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-[11px] text-text-muted hover:text-danger transition-colors ml-auto">
                          {t("cart_remove")}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer summary */}
            <div className="border-t border-border px-6 py-5 bg-white">
              <div className="flex justify-between text-sm text-text-secondary mb-1">
                <span>{t("cart_subtotal")}</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm text-text-secondary mb-3">
                <span>{t("cart_shipping")}</span>
                <span>{shipping === 0 ? t("cart_shipping_free") : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between font-semibold text-brand-brown text-base mb-4 pt-3 border-t border-border">
                <span>{t("cart_total")}</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="block w-full text-center bg-lavender text-brand-brown py-3.5 rounded-[12px] text-[16px] font-medium hover:brightness-95 transition-all"
              >
                {t("cart_checkout")}
              </Link>
              <p className="text-center text-[11px] text-text-muted mt-3">
                {shipping === 0
                  ? t("cart_free_ship_achieved")
                  : t("cart_free_ship_remaining").replace("{amount}", formatPrice(500000 - totalPrice))}
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
