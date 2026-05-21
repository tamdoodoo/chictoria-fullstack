"use client";

import Link from "next/link";
import { useLang } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-lavender text-forest overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          <div className="md:col-span-1">
            <img src="/images/Logo_footer.png" alt="Chictoria" className="h-10 md:h-13 mb-4 -ml-1" />
            <p className="text-[14px] leading-[1.3] text-forest/70">{t("footer_desc")}</p>
            <div className="flex gap-3 mt-5">
              {["Facebook", "Instagram", "TikTok"].map((s) => (
                <a key={s} href="#" className="w-9 h-9 rounded-[12px] border border-forest/30 flex items-center justify-center text-xs text-forest/60 hover:border-forest hover:text-forest transition-colors">
                  {s[0]}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[14px] font-semibold text-forest mb-4">{t("footer_products")}</h4>
            <div className="flex flex-col gap-2">
              <Link href="/shop?category=tote" className="text-[14px] text-forest/70 hover:text-forest transition-colors">Quilted Tote</Link>
              <Link href="/shop?category=hobo" className="text-[14px] text-forest/70 hover:text-forest transition-colors">Hobo Bag</Link>
              <Link href="/shop" className="text-[14px] text-forest/70 hover:text-forest transition-colors">{t("footer_all")}</Link>
            </div>
          </div>
          <div>
            <h4 className="text-[14px] font-semibold text-forest mb-4">{t("footer_support")}</h4>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-[14px] text-forest/70 hover:text-forest transition-colors">{t("footer_buying_guide")}</a>
              <a href="#" className="text-[14px] text-forest/70 hover:text-forest transition-colors">{t("footer_returns")}</a>
              <a href="#" className="text-[14px] text-forest/70 hover:text-forest transition-colors">{t("footer_shipping")}</a>
              <a href="#" className="text-[14px] text-forest/70 hover:text-forest transition-colors">{t("footer_contact")}</a>
            </div>
          </div>
          <div>
            <h4 className="text-[14px] font-semibold text-forest mb-4">{t("footer_contact")}</h4>
            <div className="flex flex-col gap-2 text-[14px] text-forest/70">
              <p>Chictoria — Bag & More</p>
              <p>DM qua Instagram / Facebook</p>
              <p>Shopee: chictoria.official</p>
            </div>
          </div>
        </div>

        <div className="border-t border-forest/15 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[12px] text-forest/50 mb-10">
          <p>&copy; 2026 Chictoria. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-forest transition-colors">{t("footer_privacy")}</a>
            <a href="#" className="hover:text-forest transition-colors">{t("footer_terms")}</a>
          </div>
        </div>
      </div>

      {/* Giant brand name — fills full width, bottom clipped */}
      <div className="relative overflow-hidden mx-[32px]">
        <p
          className="font-display font-bold text-forest select-none whitespace-nowrap leading-none text-center"
          style={{ fontSize: "clamp(40px, 18vw, 400px)", lineHeight: 1 }}
        >
          Chictoria
        </p>
      </div>
    </footer>
  );
}
