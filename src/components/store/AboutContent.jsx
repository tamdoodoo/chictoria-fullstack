"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { Sparkle, Needle, CurrencyDollar, ArrowRight, CaretLeft, CaretRight } from "@phosphor-icons/react";

const collectionBags = [
  { src: "/images/bag-black-dot.png",    nameKey: "about_bag_black_dot_name",    descKey: "about_bag_black_dot_desc",    bg: "#6B3A2A" },
  { src: "/images/bag-navy-denim.png",   nameKey: "about_bag_navy_denim_name",   descKey: "about_bag_navy_denim_desc",   bg: "#2B3548" },
  { src: "/images/bag-white-dot.png",    nameKey: "about_bag_white_dot_name",    descKey: "about_bag_white_dot_desc",    bg: "#4A5568" },
  { src: "/images/bag-indigo-denim.png", nameKey: "about_bag_indigo_denim_name", descKey: "about_bag_indigo_denim_desc", bg: "#1E2D42" },
  { src: "/images/bag-blue-denim.png",   nameKey: "about_bag_blue_denim_name",   descKey: "about_bag_blue_denim_desc",   bg: "#3B5278" },
  { src: "/images/bag-pink-stripe.png",  nameKey: "about_bag_pink_stripe_name",  descKey: "about_bag_pink_stripe_desc",  bg: "#8B5A6A" },
  { src: "/images/bag-royal-denim.png",  nameKey: "about_bag_royal_denim_name",  descKey: "about_bag_royal_denim_desc",  bg: "#3A5A90" },
  { src: "/images/bag-blue-stripe.png",  nameKey: "about_bag_blue_stripe_name",  descKey: "about_bag_blue_stripe_desc",  bg: "#5A6E88" },
];

export default function AboutContent() {
  const { t } = useLang();

  const [bagSlide, setBagSlide] = useState(0);
  const nextBag = useCallback(() => setBagSlide((i) => (i + 1) % collectionBags.length), []);
  const prevBag = useCallback(() => setBagSlide((i) => (i - 1 + collectionBags.length) % collectionBags.length), []);
  const currentBag = collectionBags[bagSlide];

  return (
    <main>
      {/* ─── Hero: Full-viewport split — About story + bag slider ─── */}
      <section className="min-h-screen relative overflow-hidden">
        {/* Left half — color transitions to match current bag */}
        <div
          className="absolute inset-y-0 left-0 w-full md:w-1/2 transition-colors duration-700 ease-in-out"
          style={{ backgroundColor: currentBag.bg }}
        />
        {/* Right white half */}
        <div className="absolute inset-y-0 right-0 w-0 md:w-1/2 bg-white" />

        <div className="relative z-10 min-h-screen grid md:grid-cols-2">
          {/* Left — about us story, vertically centered */}
          <div className="flex items-center order-2 md:order-1">
            <div className="px-8 md:px-16 lg:px-20 py-20 md:py-0 max-w-lg mx-auto">
              <p className="text-xs font-semibold uppercase tracking-[4px] text-white/40 mb-6">
                {t("about_hero_tag")}
              </p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-[44px] font-normal text-white leading-[1.15] mb-6">
                {t("about_hero_title")}
              </h1>
              <p className="text-base text-white/50 leading-relaxed mb-6">
                {t("about_hero_desc")}
              </p>
              <p className="text-sm text-white/30 italic leading-relaxed">
                {t("about_hero_belief")}
              </p>
            </div>
          </div>

          {/* Right — bag image centered + caption + controls */}
          <div className="flex flex-col items-center justify-center order-1 md:order-2 pt-24 pb-8 md:py-0">
            {/* Bag image */}
            <div className="relative w-[260px] md:w-[340px] lg:w-[400px] aspect-[3/4]">
              {collectionBags.map((bag, i) => (
                <img
                  key={i}
                  src={bag.src}
                  alt={t(bag.nameKey)}
                  className={`absolute inset-0 w-full h-full object-contain transition-all duration-600 ease-in-out ${
                    i === bagSlide ? "opacity-100 scale-100" : "opacity-0 scale-90"
                  }`}
                />
              ))}
            </div>

            {/* Caption — bag name + desc as small text */}
            <div className="text-center mt-5 h-12">
              {collectionBags.map((bag, i) => (
                <div
                  key={i}
                  className={`transition-all duration-400 ${
                    i === bagSlide ? "opacity-100" : "opacity-0 absolute pointer-events-none"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-text-primary">
                    {t(bag.nameKey)}
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {t(bag.descKey)}
                  </p>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={prevBag}
                className="w-10 h-10 rounded-full border border-text-primary/15 flex items-center justify-center text-text-secondary hover:bg-text-primary hover:text-white transition-colors"
              >
                <CaretLeft size={16} weight="bold" />
              </button>
              <div className="flex gap-1.5">
                {collectionBags.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setBagSlide(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === bagSlide ? "w-6 bg-brand-brown" : "w-2 bg-brand-brown/20"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextBag}
                className="w-10 h-10 rounded-full border border-text-primary/15 flex items-center justify-center text-text-secondary hover:bg-text-primary hover:text-white transition-colors"
              >
                <CaretRight size={16} weight="bold" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Philosophy ─── */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-5">
          <div className="max-w-xl mb-16">
            <p className="text-xs font-semibold uppercase tracking-[3px] text-brand-gold mb-4">
              {t("about_philosophy_tag")}
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-brand-brown mb-5">
              {t("about_philosophy_title")}
            </h2>
            <p className="text-text-secondary text-base leading-relaxed">
              {t("about_philosophy_desc")}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Sparkle, titleKey: "about_value_1_title", descKey: "about_value_1_desc" },
              { icon: Needle, titleKey: "about_value_2_title", descKey: "about_value_2_desc" },
              { icon: CurrencyDollar, titleKey: "about_value_3_title", descKey: "about_value_3_desc" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="group bg-white rounded-[32px] p-8 md:p-10 border border-border hover:border-brand-brown/20 transition-colors">
                  <div className="w-12 h-12 rounded-[12px] bg-lavender/30 flex items-center justify-center text-text-secondary mb-5">
                    <Icon size={24} weight="fill" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{t(item.titleKey)}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{t(item.descKey)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-5">
          <div className="relative bg-brand-brown rounded-[32px] p-10 md:p-16 overflow-hidden">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }} />
            <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-white mb-4">{t("about_cta_title")}</h2>
                <p className="text-white/60 text-base leading-relaxed mb-8 max-w-sm">{t("about_cta_desc")}</p>
                <Link href="/shop" className="inline-flex items-center gap-2 bg-white text-brand-brown px-8 py-4 rounded-full text-sm font-semibold hover:bg-brand-gold hover:text-white transition-colors">
                  {t("about_cta_button")}
                  <ArrowRight size={16} weight="bold" />
                </Link>
              </div>
              <div className="hidden md:flex justify-center">
                <img src="/images/bag-pink-stripe.png" alt="Chictoria Bag" className="w-[300px] lg:w-[360px] -rotate-6 hover:rotate-0 transition-transform duration-700 drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
