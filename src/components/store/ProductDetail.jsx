"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { formatPrice } from "@/lib/formatPrice";
import { Package, ArrowCounterClockwise, SealCheck } from "@phosphor-icons/react";
import ProductCard from "./ProductCard";

export default function ProductDetail({ product, related }) {
  const { addItem } = useCart();
  const { t, tProduct, lang } = useLang();
  const { addViewed } = useRecentlyViewed();
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    setSelectedImage(0);
    setQty(1);
    addViewed(product);
  }, [product.id]);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const name = tProduct(product, "name");
  const color = tProduct(product, "color");
  const description = tProduct(product, "description");
  const details = typeof product.details === "object" && !Array.isArray(product.details)
    ? product.details[lang] || product.details.vi
    : product.details;
  const whatFitsInside = product.whatFitsInside?.map((item) => ({
    ...item,
    label: typeof item.label === "object" ? item.label[lang] || item.label.vi : item.label,
  }));

  return (
    <main className="pt-20 md:pt-[72px]">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-5 py-5">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Link href="/" className="hover:text-brand-brown transition-colors">{t("nav_home")}</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-brand-brown transition-colors">{t("nav_shop")}</Link>
          <span>/</span>
          <span className="text-text-secondary">{name}</span>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-5 pb-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-14">
          {/* Gallery */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-cream-dark mb-3">
              <img src={product.images[selectedImage]} alt={name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${selectedImage === i ? "border-brand-brown" : "border-transparent hover:border-border"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="md:py-4">
            {product.badge && (
              <span className={`inline-block text-[11px] font-semibold px-3 py-1 rounded-full mb-3 ${product.badge === "Sale" ? "bg-danger-bg text-danger" : product.badge === "New" ? "bg-amber-50 text-brand-brown" : "bg-brand-gold/20 text-brand-brown"}`}>
                {product.badge}
              </span>
            )}

            <h1 className="font-display text-2xl md:text-3xl text-text-primary leading-snug mb-2">{name}</h1>
            <p className="text-xs uppercase tracking-widest text-text-muted mb-4">{color}</p>

            <div className="flex items-center gap-2 mb-5">
              <div className="flex text-brand-gold text-sm">{"★".repeat(Math.floor(product.rating))}</div>
              <span className="text-xs text-text-muted">{product.rating} · {product.reviews} {t("product_reviews")} · {t("product_sold")} {product.sold}</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-border">
              <span className="text-2xl font-semibold text-brand-brown">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-base text-text-muted line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="text-xs font-semibold text-danger bg-danger-bg px-2 py-0.5 rounded-full">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-text-secondary leading-relaxed mb-6">{description}</p>

            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-text-primary mb-3">{t("product_details")}</h3>
              <ul className="space-y-1.5">
                {details?.map((d, i) => (
                  <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                    <span className="text-brand-gold mt-0.5">•</span> {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stock */}
            {product.stock != null && product.stock <= 10 && (
              <p className="text-xs text-danger font-medium mb-4">
                {lang === "en" ? `Only ${product.stock} left in stock!` : `Chỉ còn ${product.stock} sản phẩm!`}
              </p>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-cream-dark transition-colors">−</button>
                <span className="w-10 h-10 flex items-center justify-center text-sm font-semibold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-cream-dark transition-colors">+</button>
              </div>
              <button onClick={() => addItem(product, qty)} className="flex-1 bg-brand-brown text-white py-3 rounded-xl text-sm font-semibold hover:bg-brand-brown-light transition-colors">
                {t("product_add_to_cart")} — {formatPrice(product.price * qty)}
              </button>
            </div>

            <Link href="/checkout" onClick={() => addItem(product, qty)} className="block w-full text-center border border-brand-brown text-brand-brown py-3 rounded-xl text-sm font-semibold hover:bg-brand-brown hover:text-white transition-colors">
              {t("product_buy_now")}
            </Link>

            <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-border">
              {[
                { icon: Package, text: t("product_trust_free_ship") },
                { icon: ArrowCounterClockwise, text: t("product_trust_return") },
                { icon: SealCheck, text: t("product_trust_authentic") },
              ].map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.text} className="flex items-center gap-1.5 text-xs text-text-muted">
                    <Icon size={14} /> {b.text}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* What Fits Inside */}
      {whatFitsInside && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-5">
            <div className="max-w-2xl mx-auto text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-[3px] text-brand-gold mb-3">{t("product_fits_title")}</p>
              <h2 className="font-display text-2xl md:text-3xl text-brand-brown mb-2">{t("product_fits_title")}</h2>
              <p className="text-sm text-text-secondary">{t("product_fits_desc")}</p>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-xl mx-auto">
              {whatFitsInside.map((item) => (
                <div key={item.label} className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-cream flex items-center justify-center text-2xl mb-2">{item.icon}</div>
                  <p className="text-xs text-text-secondary">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-10">
              <h2 className="font-display text-2xl text-brand-brown">{t("product_related_title")}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sticky Add-to-Cart (Mobile) */}
      <div className={`fixed bottom-0 inset-x-0 z-50 md:hidden bg-white border-t border-border px-5 py-3 transition-transform duration-300 ${showSticky ? "translate-y-0" : "translate-y-full"}`}>
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <p className="text-xs text-text-muted">{String(name).substring(0, 20)}...</p>
            <p className="text-base font-semibold text-brand-brown">{formatPrice(product.price)}</p>
          </div>
          <button onClick={() => addItem(product)} className="flex-1 bg-brand-brown text-white py-3 rounded-xl text-sm font-semibold">
            {t("card_add_to_cart")}
          </button>
        </div>
      </div>
    </main>
  );
}
