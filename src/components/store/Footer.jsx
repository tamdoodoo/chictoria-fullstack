"use client";

import Link from "next/link";
import { useLang } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-brand-brown-dark text-white/70">
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <img src="/images/Logo.jpeg" alt="Chictoria" className="h-12 rounded-lg mb-4" />
            <p className="text-sm leading-relaxed text-white/40">{t("footer_desc")}</p>
            <div className="flex gap-3 mt-5">
              {["Facebook", "Instagram", "TikTok"].map((s) => (
                <a key={s} href="#" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-xs text-white/40 hover:border-brand-gold hover:text-brand-gold transition-colors">
                  {s[0]}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-4">{t("footer_products")}</h4>
            <div className="flex flex-col gap-2">
              <Link href="/shop?category=tote" className="text-sm text-white/40 hover:text-brand-gold transition-colors">Quilted Tote</Link>
              <Link href="/shop?category=hobo" className="text-sm text-white/40 hover:text-brand-gold transition-colors">Hobo Bag</Link>
              <Link href="/shop" className="text-sm text-white/40 hover:text-brand-gold transition-colors">{t("footer_all")}</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-4">{t("footer_support")}</h4>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-sm text-white/40 hover:text-brand-gold transition-colors">{t("footer_buying_guide")}</a>
              <a href="#" className="text-sm text-white/40 hover:text-brand-gold transition-colors">{t("footer_returns")}</a>
              <a href="#" className="text-sm text-white/40 hover:text-brand-gold transition-colors">{t("footer_shipping")}</a>
              <a href="#" className="text-sm text-white/40 hover:text-brand-gold transition-colors">{t("footer_contact")}</a>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-4">{t("footer_contact")}</h4>
            <div className="flex flex-col gap-2 text-sm text-white/40">
              <p>Chictoria — Bag & More</p>
              <p>DM qua Instagram / Facebook</p>
              <p>Shopee: chictoria.official</p>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/25">
          <p>&copy; 2026 Chictoria. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white/50 transition-colors">{t("footer_privacy")}</a>
            <a href="#" className="hover:text-white/50 transition-colors">{t("footer_terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
