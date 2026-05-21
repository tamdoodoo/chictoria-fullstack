"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/formatPrice";
import { Star, Needle, Briefcase, FlowerTulip, Package, ArrowCounterClockwise, Lock, Diamond, Quotes } from "@phosphor-icons/react";
import ProductCard from "./ProductCard";

export default function HomeContent({ products }) {
  const { t } = useLang();
  const [carouselPaused, setCarouselPaused] = useState(false);

  return (
    <main>
      {/* Hero */}
      <section className="min-h-screen flex items-center pt-16 md:pt-[72px]">
        <div className="max-w-6xl mx-auto px-5 py-10 w-full">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="order-2 md:order-1">
              <p className="text-[14px] text-text-muted mb-6">
                {t("hero_subtitle")}
              </p>
              <h1 className="font-display text-[48px] md:text-[64px] font-medium leading-[1.15] text-text-primary mb-8 tracking-[-0.04em]">
                {t("hero_title_1")} <br />
                <span className="relative inline-block">
                  {t("hero_title_2")}
                  <span className="absolute bottom-1 left-0 right-0 h-3 bg-lavender/60 -z-10" />
                </span>{" "}
                {t("hero_title_3")}
              </h1>
              <p className="text-text-secondary text-[16px] leading-[1.3] mb-10 max-w-md">
                {t("hero_desc")} {formatPrice(319000)}.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-lavender text-brand-brown px-8 py-3.5 rounded-[12px] text-[16px] font-medium hover:brightness-95 transition-all"
                >
                  {t("hero_cta_shop")}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/product/quilted-tote-cream"
                  className="inline-flex items-center gap-2 border border-brand-brown text-brand-brown px-8 py-3.5 rounded-[12px] text-[16px] font-medium hover:bg-brand-brown hover:text-cream transition-colors"
                >
                  {t("hero_cta_bestseller")}
                </Link>
              </div>

              <div className="flex gap-10 mt-14 pt-8 border-t border-border">
                {[
                  { value: "500+", label: t("hero_stat_sold") },
                  { value: "5.0 ★", label: t("hero_stat_rating") },
                  { value: "2 in 1", label: t("hero_stat_reversible") },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-[32px] font-normal leading-[1.3] text-text-primary tracking-[-0.03em]">{s.value}</p>
                    <p className="text-[14px] text-text-muted mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 md:order-2">
              <img
                src="/images/hero-new.png"
                alt="Chictoria Collection"
                className="w-full rounded-[40px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-forest text-white/70 py-3.5 overflow-hidden">
        <div className="whitespace-nowrap animate-[marquee_30s_linear_infinite] inline-block">
          {[...Array(2)].map((_, i) => (
            <span key={i}>
              <span className="mx-10 text-[14px] inline-flex items-center gap-2"><Diamond size={8} weight="fill" /> {t("marquee_free_ship")}</span>
              <span className="mx-10 text-[14px] inline-flex items-center gap-2"><Diamond size={8} weight="fill" /> {t("marquee_reversible")}</span>
              <span className="mx-10 text-[14px] inline-flex items-center gap-2"><Diamond size={8} weight="fill" /> {t("marquee_quilted")}</span>
              <span className="mx-10 text-[14px] inline-flex items-center gap-2"><Diamond size={8} weight="fill" /> {t("marquee_return")}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Featured Products — Sliding Carousel */}
      <section className="py-[64px] md:py-[96px] overflow-hidden relative" style={{ backgroundImage: "url('/images/pattern-bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="relative z-10 max-w-6xl mx-auto px-5 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <p className="text-[14px] text-text-muted mb-3">{t("featured_subtitle")}</p>
              <h2 className="font-display text-[48px] font-normal text-text-primary leading-[0.95] tracking-[-0.05em]">
                <span className="relative inline-block">
                  {t("featured_title")}
                  <span className="absolute bottom-1 left-0 right-0 h-3 bg-lavender/60 -z-10" />
                </span>
              </h2>
            </div>
            <Link href="/shop" className="text-[16px] text-text-secondary border-b border-brand-brown pb-0.5 hover:text-text-primary transition-colors mt-4 md:mt-0">
              {t("featured_view_all")}
            </Link>
          </div>
        </div>

        <div
          className="relative z-10"
          onMouseEnter={() => setCarouselPaused(true)}
          onMouseLeave={() => setCarouselPaused(false)}
        >
          <div
            className="flex gap-[24px] w-max"
            style={{
              animationName: "product-slide",
              animationDuration: "30s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationPlayState: carouselPaused ? "paused" : "running",
            }}
          >
            {[...products, ...products, ...products].map((product, i) => (
              <div key={`${product.id}-${i}`} className="w-[280px] md:w-[320px] shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collection Overview */}
      <section className="py-[64px] md:py-[96px]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-[14px] text-text-muted mb-4">{t("collection_subtitle")}</p>
            <h2 className="font-display text-[48px] font-normal text-text-primary leading-[0.95] tracking-[-0.05em]">{t("collection_title")}</h2>
            <p className="text-text-secondary text-[16px] max-w-md mx-auto mt-5 leading-[1.3]">{t("collection_desc")}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/shop?category=tote" className="group relative rounded-[32px] overflow-hidden aspect-[4/3]">
              <img src="/images/SKU2-1.jpg" alt="Quilted Tote" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <p className="text-[14px] text-white/50 mb-2">Quilted Collection</p>
                <h3 className="font-display text-[32px] font-normal text-white leading-[1.3] tracking-[-0.03em] mb-3">Quilted Tote</h3>
                <p className="text-[14px] text-white/50 mb-4">{t("collection_quilted_desc")}</p>
                <span className="inline-flex items-center text-[14px] text-white border-b border-white/30 pb-0.5 group-hover:border-lavender group-hover:text-lavender transition-colors">
                  {t("collection_explore")}
                </span>
              </div>
            </Link>
            <Link href="/shop?category=hobo" className="group relative rounded-[32px] overflow-hidden aspect-[4/3]">
              <img src="/images/products-showcase-1.jpg" alt="Hobo Bag" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <p className="text-[14px] text-white/50 mb-2">Reversible Collection</p>
                <h3 className="font-display text-[32px] font-normal text-white leading-[1.3] tracking-[-0.03em] mb-3">Hobo Bag</h3>
                <p className="text-[14px] text-white/50 mb-4">{t("collection_hobo_desc")}</p>
                <span className="inline-flex items-center text-[14px] text-white border-b border-white/30 pb-0.5 group-hover:border-lavender group-hover:text-lavender transition-colors">
                  {t("collection_explore")}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Lifestyle / Why Chictoria */}
      <section className="py-[64px] md:py-[96px]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="grid grid-cols-2 gap-6">
              <img src="/images/SKU1-1.jpg" alt="Lifestyle" className="rounded-[40px] w-full aspect-square object-cover" />
              <img src="/images/SKU4-2.jpg" alt="Lifestyle" className="rounded-[40px] w-full aspect-square object-cover mt-10" />
            </div>
            <div>
              <p className="text-[14px] text-text-muted mb-5">{t("why_subtitle")}</p>
              <h2 className="font-display text-[48px] font-normal text-text-primary leading-[0.95] tracking-[-0.05em] mb-10">
                {t("why_title")}
              </h2>
              <div className="space-y-6">
                {[
                  { icon: Star, title: t("why_1_title"), desc: t("why_1_desc") },
                  { icon: Needle, title: t("why_2_title"), desc: t("why_2_desc") },
                  { icon: Briefcase, title: t("why_3_title"), desc: t("why_3_desc") },
                  { icon: FlowerTulip, title: t("why_4_title"), desc: t("why_4_desc") },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-[12px] bg-lavender/30 flex items-center justify-center text-text-secondary shrink-0 mt-0.5">
                      <Icon size={18} weight="regular" />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-semibold text-text-primary mb-1">{item.title}</h3>
                      <p className="text-[14px] text-text-muted leading-[1.3]">{item.desc}</p>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials — Forest Canopy dark */}
      <section className="min-h-screen flex flex-col justify-center bg-forest text-white relative overflow-hidden py-16 md:py-20" style={{ backgroundImage: "url('/images/pattern-bg.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundBlendMode: "soft-light" }}>
        <div className="max-w-6xl mx-auto px-5 relative z-10 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 md:mb-16">
            <div>
              <p className="text-[14px] text-white/40 mb-4">{t("testimonials_subtitle")}</p>
              <h2 className="font-display text-[48px] font-normal leading-[0.95] tracking-[-0.05em]">
                {t("testimonials_title_1")}<br />
                <span className="relative inline-block">
                  {t("testimonials_title_2")}
                  <span className="absolute bottom-1 left-0 right-0 h-3 bg-lavender/40 -z-10" />
                </span>
              </h2>
            </div>
            <p className="text-white/40 text-[16px] leading-[1.3] max-w-sm">{t("testimonials_desc")}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ gridTemplateRows: "1fr 1fr" }}>
            <div className="col-span-1 row-span-2 relative group rounded-[32px] overflow-hidden min-h-[280px] md:min-h-0">
              <img src="/images/SKU1-1.jpg" alt="Customer" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <Quotes size={20} weight="fill" className="text-lavender mb-2 opacity-70" />
                <p className="text-[14px] leading-[1.3] text-white/90 mb-3 line-clamp-4">{t("testimonial_1_quote")}</p>
                <p className="text-[14px] text-white/40">{t("testimonial_1_name")} — {t("testimonial_1_role")}</p>
              </div>
            </div>

            <div className="bg-cream rounded-[32px] p-5 flex flex-col justify-between">
              <div>
                <Quotes size={20} weight="fill" className="text-forest mb-2" />
                <p className="text-[14px] leading-[1.3] text-text-primary line-clamp-5">{t("testimonial_2_quote")}</p>
              </div>
              <p className="text-[14px] text-text-muted mt-4">{t("testimonial_2_name")} — {t("testimonial_2_role")}</p>
            </div>

            <div className="relative group rounded-[32px] overflow-hidden">
              <img src="/images/SKU3.jpg" alt="Styling" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 rounded-[32px]" />
            </div>

            <div className="col-span-1 row-span-2 relative group rounded-[32px] overflow-hidden min-h-[280px] md:min-h-0">
              <img src="/images/SKU4.jpg" alt="Lifestyle" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <Quotes size={20} weight="fill" className="text-lavender mb-2 opacity-70" />
                <p className="text-[14px] leading-[1.3] text-white/90 mb-3 line-clamp-4">{t("testimonial_4_quote")}</p>
                <p className="text-[14px] text-white/40">{t("testimonial_4_name")} — {t("testimonial_4_role")}</p>
              </div>
            </div>

            <div className="relative group rounded-[32px] overflow-hidden">
              <img src="/images/products-showcase-1.jpg" alt="Collection" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 rounded-[32px]" />
            </div>

            <div className="bg-cream rounded-[32px] p-5 flex flex-col justify-between">
              <div>
                <Quotes size={20} weight="fill" className="text-forest mb-2" />
                <p className="text-[14px] leading-[1.3] text-text-primary line-clamp-5">{t("testimonial_3_quote")}</p>
              </div>
              <p className="text-[14px] text-text-muted mt-4">{t("testimonial_3_name")} — {t("testimonial_3_role")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-[64px] border-t border-border">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Package, title: t("feature_free_ship"), desc: t("feature_free_ship_desc") },
              { icon: ArrowCounterClockwise, title: t("feature_return"), desc: t("feature_return_desc") },
              { icon: Lock, title: t("feature_payment"), desc: t("feature_payment_desc") },
              { icon: Diamond, title: t("feature_quality"), desc: t("feature_quality_desc") },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="text-center">
                  <div className="w-10 h-10 mx-auto rounded-[12px] bg-lavender/30 flex items-center justify-center text-text-secondary mb-4">
                    <Icon size={18} weight="regular" />
                  </div>
                  <h3 className="text-[16px] font-semibold text-text-primary mb-1">{f.title}</h3>
                  <p className="text-[14px] text-text-muted">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-[64px] bg-cream-dark">
        <div className="max-w-md mx-auto px-5 text-center">
          <p className="text-[14px] text-text-muted mb-4">{t("newsletter_subtitle")}</p>
          <h2 className="font-display text-[32px] font-normal text-text-primary leading-[1.3] tracking-[-0.03em] mb-5">{t("newsletter_title")}</h2>
          <p className="text-[14px] text-text-muted mb-8 leading-[1.3]">{t("newsletter_desc")}</p>
          <form onSubmit={(e) => { e.preventDefault(); alert(t("newsletter_thanks")); }} className="flex gap-2">
            <input type="email" placeholder={t("newsletter_placeholder")} required className="flex-1 px-5 py-3 rounded-[14px] border border-border text-[16px] text-text-primary bg-cream outline-none placeholder:text-text-muted focus:border-brand-brown transition-colors" />
            <button className="bg-lavender text-brand-brown px-6 py-3 rounded-[12px] text-[16px] font-medium hover:brightness-95 transition-all shrink-0">
              {t("newsletter_button")}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
