"use client";

import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/formatPrice";
import { FireSimple, Sparkle, Star, Needle, Briefcase, FlowerTulip, Package, ArrowCounterClockwise, Lock, Diamond, Quotes } from "@phosphor-icons/react";
import ProductCard from "./ProductCard";

export default function HomeContent({ products }) {
  const { t } = useLang();

  return (
    <main>
      {/* Hero */}
      <section className="min-h-screen flex items-center pt-16 md:pt-[72px]">
        <div className="max-w-6xl mx-auto px-5 py-8 md:py-10 w-full">
          <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-center">
            <div className="order-2 md:order-1">
              <p className="text-xs font-semibold uppercase tracking-[4px] text-brand-gold mb-4">
                {t("hero_subtitle")}
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-[56px] font-normal leading-[1.1] text-text-primary mb-6">
                {t("hero_title_1")} <br />
                <span className="text-brand-brown">
                  {t("hero_title_2")}
                </span>{" "}
                {t("hero_title_3")}
              </h1>
              <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-8 max-w-md">
                {t("hero_desc")} {formatPrice(319000)}.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-brand-brown text-white px-7 py-3.5 rounded-full text-sm font-medium hover:bg-brand-brown-light transition-colors"
                >
                  {t("hero_cta_shop")}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/product/quilted-tote-cream"
                  className="inline-flex items-center gap-2 border border-text-primary/20 text-text-primary px-7 py-3.5 rounded-full text-sm font-medium hover:bg-text-primary hover:text-white transition-colors"
                >
                  {t("hero_cta_bestseller")}
                </Link>
              </div>

              <div className="flex gap-8 mt-10 pt-8 border-t border-border">
                {[
                  { value: "500+", label: t("hero_stat_sold") },
                  { value: "5.0 ★", label: t("hero_stat_rating") },
                  { value: "2 in 1", label: t("hero_stat_reversible") },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-xl md:text-2xl font-semibold text-brand-brown">{s.value}</p>
                    <p className="text-xs text-text-muted uppercase tracking-wider mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="relative">
                <img
                  src="/images/products-showcase-2.jpg"
                  alt="Chictoria Collection"
                  className="w-full rounded-3xl shadow-xl"
                />
                <div className="absolute top-[20%] -left-4 md:-left-5 -translate-y-1/2 bg-danger text-white rounded-2xl px-4 py-3 shadow-lg animate-bounce-slow z-10" style={{ animationDelay: "1s" }}>
                  <p className="text-sm font-bold flex items-center gap-1.5"><FireSimple size={16} weight="fill" /> {t("badge_trending")}</p>
                  <p className="text-xs opacity-80">{t("badge_hot")}</p>
                </div>
                <div className="absolute top-1/2 -right-4 md:-right-5 -translate-y-1/2 bg-white rounded-2xl p-4 shadow-lg animate-bounce-slow z-10">
                  <p className="text-xs text-text-muted">{t("badge_from")}</p>
                  <p className="text-lg font-semibold text-brand-brown">{formatPrice(319000)}</p>
                  <p className="text-xs text-text-muted">{t("badge_free_ship")}</p>
                </div>
                <div className="absolute bottom-[20%] -left-4 md:-left-5 translate-y-1/2 bg-white/90 backdrop-blur rounded-2xl px-4 py-3 shadow-lg animate-bounce-slow z-10" style={{ animationDelay: "2s" }}>
                  <p className="text-sm font-bold text-brand-brown flex items-center gap-1.5"><Sparkle size={16} weight="fill" /> {t("badge_variety")}</p>
                  <p className="text-xs text-text-muted">{t("badge_designs")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-brand-brown text-white/80 py-3 overflow-hidden">
        <div className="whitespace-nowrap animate-[marquee_30s_linear_infinite] inline-block">
          {[...Array(2)].map((_, i) => (
            <span key={i}>
              <span className="mx-8 text-xs font-medium tracking-widest uppercase inline-flex items-center gap-1.5"><Diamond size={10} weight="fill" /> {t("marquee_free_ship")}</span>
              <span className="mx-8 text-xs font-medium tracking-widest uppercase inline-flex items-center gap-1.5"><Diamond size={10} weight="fill" /> {t("marquee_reversible")}</span>
              <span className="mx-8 text-xs font-medium tracking-widest uppercase inline-flex items-center gap-1.5"><Diamond size={10} weight="fill" /> {t("marquee_quilted")}</span>
              <span className="mx-8 text-xs font-medium tracking-widest uppercase inline-flex items-center gap-1.5"><Diamond size={10} weight="fill" /> {t("marquee_return")}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Collection Overview */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[3px] text-brand-gold mb-3">{t("collection_subtitle")}</p>
            <h2 className="font-display text-3xl md:text-4xl text-brand-brown mb-3">{t("collection_title")}</h2>
            <p className="text-text-secondary max-w-md mx-auto">{t("collection_desc")}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/shop?category=tote" className="group relative rounded-3xl overflow-hidden aspect-[4/3]">
              <img src="/images/SKU2-1.jpg" alt="Quilted Tote" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <p className="text-xs font-semibold tracking-widest text-brand-gold uppercase mb-2">Quilted Collection</p>
                <h3 className="text-2xl font-display text-white mb-2">Quilted Tote</h3>
                <p className="text-sm text-white/60 mb-4">{t("collection_quilted_desc")}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-white border-b border-white/30 pb-0.5 group-hover:border-brand-gold group-hover:text-brand-gold transition-colors">
                  {t("collection_explore")}
                </span>
              </div>
            </Link>
            <Link href="/shop?category=hobo" className="group relative rounded-3xl overflow-hidden aspect-[4/3]">
              <img src="/images/products-showcase-1.jpg" alt="Hobo Bag" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <p className="text-xs font-semibold tracking-widest text-brand-gold uppercase mb-2">Reversible Collection</p>
                <h3 className="text-2xl font-display text-white mb-2">Hobo Bag</h3>
                <p className="text-sm text-white/60 mb-4">{t("collection_hobo_desc")}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-white border-b border-white/30 pb-0.5 group-hover:border-brand-gold group-hover:text-brand-gold transition-colors">
                  {t("collection_explore")}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[3px] text-brand-gold mb-3">{t("featured_subtitle")}</p>
              <h2 className="font-display text-3xl md:text-4xl text-brand-brown">{t("featured_title")}</h2>
            </div>
            <Link href="/shop" className="text-sm font-medium text-brand-brown border-b border-brand-brown/30 pb-0.5 hover:border-brand-brown transition-colors mt-4 md:mt-0">
              {t("featured_view_all")}
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Lifestyle */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="grid grid-cols-2 gap-4">
              <img src="/images/SKU1-1.jpg" alt="Lifestyle" className="rounded-2xl w-full aspect-square object-cover" />
              <img src="/images/SKU4-2.jpg" alt="Lifestyle" className="rounded-2xl w-full aspect-square object-cover mt-8" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[3px] text-brand-gold mb-4">{t("why_subtitle")}</p>
              <h2 className="font-display text-3xl md:text-4xl text-brand-brown mb-6">{t("why_title")}</h2>
              <div className="space-y-5">
                {[
                  { icon: Star, title: t("why_1_title"), desc: t("why_1_desc") },
                  { icon: Needle, title: t("why_2_title"), desc: t("why_2_desc") },
                  { icon: Briefcase, title: t("why_3_title"), desc: t("why_3_desc") },
                  { icon: FlowerTulip, title: t("why_4_title"), desc: t("why_4_desc") },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-brown/10 flex items-center justify-center text-brand-brown shrink-0 mt-0.5">
                      <Icon size={20} weight="fill" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary mb-1">{item.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="min-h-screen flex flex-col justify-center bg-brand-brown-dark text-white relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="max-w-6xl mx-auto px-5 relative z-10 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[3px] text-brand-gold mb-4">
                {t("testimonials_subtitle")}
              </p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-normal leading-[1.15]">
                {t("testimonials_title_1")}
                <br />
                <span className="text-brand-gold">{t("testimonials_title_2")}</span>
              </h2>
            </div>
            <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-sm">
              {t("testimonials_desc")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" style={{ gridTemplateRows: "1fr 1fr" }}>
            <div className="col-span-1 row-span-2 relative group rounded-2xl overflow-hidden min-h-[280px] md:min-h-0">
              <img src="/images/SKU1-1.jpg" alt="Customer with Chictoria bag" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <Quotes size={20} weight="fill" className="text-brand-gold mb-2 opacity-70" />
                <p className="text-xs md:text-sm leading-relaxed text-white/90 mb-3 line-clamp-4">{t("testimonial_1_quote")}</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold text-[10px] font-bold shrink-0">{t("testimonial_1_name").charAt(0)}</div>
                  <div>
                    <p className="text-xs font-medium">{t("testimonial_1_name")}</p>
                    <p className="text-[10px] text-white/40">{t("testimonial_1_role")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.06] backdrop-blur-sm rounded-2xl p-4 md:p-5 flex flex-col justify-between border border-white/[0.06]">
              <div>
                <Quotes size={20} weight="fill" className="text-brand-gold mb-2 opacity-50" />
                <p className="text-xs md:text-sm leading-relaxed text-white/80 line-clamp-5">{t("testimonial_2_quote")}</p>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div className="w-7 h-7 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold text-[10px] font-bold shrink-0">{t("testimonial_2_name").charAt(0)}</div>
                <div>
                  <p className="text-xs font-medium">{t("testimonial_2_name")}</p>
                  <p className="text-[10px] text-white/40">{t("testimonial_2_role")}</p>
                </div>
              </div>
            </div>

            <div className="relative group rounded-2xl overflow-hidden">
              <img src="/images/SKU3.jpg" alt="Chictoria bag styling" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="col-span-1 row-span-2 relative group rounded-2xl overflow-hidden min-h-[280px] md:min-h-0">
              <img src="/images/SKU4.jpg" alt="Chictoria bag lifestyle" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <Quotes size={20} weight="fill" className="text-brand-gold mb-2 opacity-70" />
                <p className="text-xs md:text-sm leading-relaxed text-white/90 mb-3 line-clamp-4">{t("testimonial_4_quote")}</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold text-[10px] font-bold shrink-0">{t("testimonial_4_name").charAt(0)}</div>
                  <div>
                    <p className="text-xs font-medium">{t("testimonial_4_name")}</p>
                    <p className="text-[10px] text-white/40">{t("testimonial_4_role")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group rounded-2xl overflow-hidden">
              <img src="/images/products-showcase-1.jpg" alt="Chictoria collection" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="bg-white/[0.06] backdrop-blur-sm rounded-2xl p-4 md:p-5 flex flex-col justify-between border border-white/[0.06]">
              <div>
                <Quotes size={20} weight="fill" className="text-brand-gold mb-2 opacity-50" />
                <p className="text-xs md:text-sm leading-relaxed text-white/80 line-clamp-5">{t("testimonial_3_quote")}</p>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div className="w-7 h-7 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold text-[10px] font-bold shrink-0">{t("testimonial_3_name").charAt(0)}</div>
                <div>
                  <p className="text-xs font-medium">{t("testimonial_3_name")}</p>
                  <p className="text-[10px] text-white/40">{t("testimonial_3_role")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white border-t border-border">
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
                  <div className="w-10 h-10 mx-auto rounded-xl bg-brand-brown/10 flex items-center justify-center text-brand-brown mb-3">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">{f.title}</h3>
                  <p className="text-xs text-text-muted">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-cream-dark">
        <div className="max-w-md mx-auto px-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[3px] text-brand-gold mb-3">{t("newsletter_subtitle")}</p>
          <h2 className="font-display text-2xl text-brand-brown mb-3">{t("newsletter_title")}</h2>
          <p className="text-sm text-text-secondary mb-6">{t("newsletter_desc")}</p>
          <form onSubmit={(e) => { e.preventDefault(); alert(t("newsletter_thanks")); }} className="flex gap-2">
            <input type="email" placeholder={t("newsletter_placeholder")} required className="flex-1 px-5 py-3 rounded-full border border-border bg-white text-sm outline-none focus:border-brand-gold transition-colors" />
            <button className="bg-brand-brown text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-brand-brown-light transition-colors shrink-0">
              {t("newsletter_button")}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
