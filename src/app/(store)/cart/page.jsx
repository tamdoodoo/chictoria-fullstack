"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/formatPrice";
import { ShoppingCart } from "@phosphor-icons/react";

export default function CartPage() {
  const { items, removeItem, updateQty, totalPrice } = useCart();
  const { t, lang } = useLang();
  const shipping = totalPrice >= 500000 ? 0 : 30000;
  const total = totalPrice + shipping;

  const getName = (item) => {
    if (typeof item.name === "object") return item.name[lang] || item.name.vi;
    return item.name;
  };

  return (
    <main className="pt-20 md:pt-[72px]">
      <div className="bg-brand-brown text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "22px 22px" }} />
        <div className="max-w-6xl mx-auto px-5 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 text-xs text-white/40 mb-4">
            <Link href="/" className="hover:text-brand-gold transition-colors">{t("nav_home")}</Link>
            <span>/</span>
            <span className="text-white/60">{t("cart_title")}</span>
          </div>
          <h1 className="font-display text-3xl">{t("cart_title")}</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-10 md:py-14">
        {items.length === 0 ? (
          <div className="text-center py-20 max-w-md mx-auto">
            <div className="mb-6 opacity-30 flex justify-center"><ShoppingCart size={56} /></div>
            <h2 className="font-display text-xl text-brand-brown mb-3">{t("cart_empty_title")}</h2>
            <p className="text-sm text-text-secondary mb-8">{t("cart_empty_desc")}</p>
            <Link href="/shop" className="inline-flex items-center gap-2 bg-brand-brown text-white px-7 py-3 rounded-full text-sm font-medium hover:bg-brand-brown-light transition-colors">
              {t("cart_shop_now")}
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-[1fr_380px] gap-10 items-start">
            <div>
              <h2 className="text-sm font-semibold text-text-primary mb-6">
                {items.reduce((s, i) => s + i.qty, 0)} {t("cart_items")}
              </h2>
              <div className="space-y-0 divide-y divide-border">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-5">
                    <Link href={`/product/${item.id}`} className="shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-cream-dark">
                      <img src={item.image} alt={getName(item)} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.id}`} className="text-sm font-medium text-text-primary hover:text-brand-brown transition-colors line-clamp-1">
                        {getName(item)}
                      </Link>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center border border-border rounded-lg overflow-hidden">
                          <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-8 h-8 flex items-center justify-center text-text-muted hover:bg-cream-dark text-sm">−</button>
                          <span className="w-8 h-8 flex items-center justify-center text-xs font-semibold">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-8 h-8 flex items-center justify-center text-text-muted hover:bg-cream-dark text-sm">+</button>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-brand-brown">{formatPrice(item.price * item.qty)}</p>
                      <button onClick={() => removeItem(item.id)} className="text-xs text-text-muted hover:text-danger mt-2 transition-colors underline">
                        {t("cart_remove")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-border sticky top-24">
              <h2 className="font-display text-lg text-brand-brown mb-5 pb-4 border-b border-border">{t("cart_summary")}</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>{t("cart_subtotal")}</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>{t("cart_shipping")}</span>
                  <span>{shipping === 0 ? t("cart_shipping_free") : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-semibold text-brand-brown text-base pt-3 border-t border-border">
                  <span>{t("cart_total")}</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Link href="/checkout" className="block w-full text-center bg-brand-brown text-white py-3.5 rounded-xl text-sm font-semibold mt-6 hover:bg-brand-brown-light transition-colors">
                {t("cart_checkout")}
              </Link>
              <p className="text-center text-xs text-text-muted mt-4">
                {shipping === 0
                  ? t("cart_free_ship_achieved")
                  : t("cart_free_ship_remaining").replace("{amount}", formatPrice(500000 - totalPrice))}
              </p>
              <Link href="/shop" className="block text-center text-sm text-brand-brown mt-4 underline hover:no-underline">
                {t("cart_continue")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
