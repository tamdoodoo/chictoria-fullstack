"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { User, ShoppingBag, SignOut, Heart, MapPin, Package } from "@phosphor-icons/react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { totalItems, openDrawer } = useCart();
  const pathname = usePathname();
  const { lang, toggleLang, t } = useLang();
  const { user, profile, loading, logout } = useAuth();
  const userMenuRef = useRef(null);
  const shopMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setShopOpen(false); }, [pathname]);
  useEffect(() => setUserMenuOpen(false), [pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (shopMenuRef.current && !shopMenuRef.current.contains(e.target)) setShopOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navLinks = [
    { href: "/", label: t("nav_home") },
    { href: "/about", label: t("nav_about") },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-16 md:h-[72px]">
        <Link href="/" className="flex items-center shrink-0">
          <img src="/images/Logo_header.png" alt="Chictoria" className="h-8 md:h-10" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-display text-[16px] transition-colors hover:text-brand-brown ${
                pathname === link.href ? "text-brand-brown" : "text-text-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Shop dropdown */}
          <div className="relative" ref={shopMenuRef}>
            <button
              onClick={() => setShopOpen(!shopOpen)}
              className={`font-display text-[16px] transition-colors hover:text-brand-brown flex items-center gap-1 ${
                pathname.startsWith("/shop") ? "text-brand-brown" : "text-text-secondary"
              }`}
            >
              {t("nav_shop")}
              <svg className={`w-3.5 h-3.5 transition-transform ${shopOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="text-[14px] font-medium px-4 py-1.5 rounded-[12px] border border-brand-brown text-brand-brown hover:bg-lavender hover:border-lavender transition-colors"
          >
            {lang === "vi" ? "EN" : "VI"}
          </button>

          {!loading && (
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="p-2 hover:text-brand-brown transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-forest text-white flex items-center justify-center text-xs font-semibold">
                      {(profile?.name || user.email || "U").charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-cream rounded-[14px] shadow-lg border border-border py-2 z-50">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-[14px] font-medium text-text-primary truncate">{profile?.name || user.email}</p>
                        <p className="text-[12px] text-text-muted truncate">{user.email}</p>
                      </div>
                      <Link href="/account" className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-text-secondary hover:bg-cream-dark transition-colors">
                        <User size={16} /> {t("account_profile")}
                      </Link>
                      <Link href="/account/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-text-secondary hover:bg-cream-dark transition-colors">
                        <Package size={16} /> {t("account_orders")}
                      </Link>
                      <Link href="/account/wishlist" className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-text-secondary hover:bg-cream-dark transition-colors">
                        <Heart size={16} /> {t("account_wishlist")}
                      </Link>
                      <Link href="/account/addresses" className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-text-secondary hover:bg-cream-dark transition-colors">
                        <MapPin size={16} /> {t("account_addresses")}
                      </Link>
                      <div className="border-t border-border mt-1 pt-1">
                        <button
                          onClick={logout}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-danger hover:bg-danger-bg transition-colors w-full text-left"
                        >
                          <SignOut size={16} /> {t("auth_logout")}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link href="/login" className="p-2 hover:text-brand-brown transition-colors">
                  <User size={20} />
                </Link>
              )}
            </div>
          )}

          <button onClick={openDrawer} className="relative p-2 hover:text-brand-brown transition-colors">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-lavender text-brand-brown text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <div className="w-5 flex flex-col gap-1">
              <span className={`h-0.5 bg-text-primary rounded transition-all ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`h-0.5 bg-text-primary rounded transition-all ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`h-0.5 bg-text-primary rounded transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Shop mega dropdown */}
      <div className={`hidden md:block overflow-hidden transition-all duration-300 ease-in-out ${shopOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-forest">
          <div className="max-w-6xl mx-auto px-5 py-10">
            <div className="grid grid-cols-[200px_200px_1fr] gap-12">
              <div>
                <p className="text-[14px] text-white/50 mb-4">{t("nav_shop")}</p>
                <div className="flex flex-col gap-2.5">
                  <Link href="/shop" className="text-[16px] text-white hover:underline">{t("shop_cat_all")}</Link>
                  <Link href="/shop?category=tote" className="text-[16px] text-white hover:underline">{t("nav_quilted_tote")}</Link>
                  <Link href="/shop?category=hobo" className="text-[16px] text-white hover:underline">{t("nav_hobo_bag")}</Link>
                </div>
              </div>
              <div>
                <p className="text-[14px] text-white/50 mb-4">Collections</p>
                <div className="flex flex-col gap-2.5">
                  <Link href="/shop?category=tote" className="text-[16px] text-white hover:underline">Quilted Collection</Link>
                  <Link href="/shop?category=hobo" className="text-[16px] text-white hover:underline">Reversible Collection</Link>
                  <Link href="/shop" className="text-[16px] text-white hover:underline">{t("featured_view_all")}</Link>
                </div>
              </div>
              <div>
                <p className="text-[14px] text-white/50 mb-4">{t("featured_subtitle")}</p>
                <div className="flex gap-4 overflow-x-auto">
                  {[
                    { img: "/images/SKU1-1.jpg", label: "Hobo — Cream" },
                    { img: "/images/SKU2-1.jpg", label: "Tote — Cream" },
                    { img: "/images/SKU3.jpg", label: "Hobo — Black" },
                    { img: "/images/SKU4.jpg", label: "Hobo — Blue" },
                  ].map((item) => (
                    <Link href="/shop" key={item.label} className="shrink-0 group">
                      <div className="w-[120px] aspect-square rounded-[14px] overflow-hidden bg-white/10 mb-2">
                        <img src={item.img} alt={item.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <p className="text-[14px] text-white/70 text-center">{item.label}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 bg-cream border-t border-border ${menuOpen ? "max-h-[500px]" : "max-h-0"}`}>
        <nav className="px-5 py-4 flex flex-col gap-3">
          <Link href="/" className="text-[16px] text-text-secondary hover:text-brand-brown py-1">{t("nav_home")}</Link>
          <Link href="/about" className="text-[16px] text-text-secondary hover:text-brand-brown py-1">{t("nav_about")}</Link>
          <div className="border-t border-border pt-3 mt-1">
            <p className="text-[14px] text-text-muted mb-2">{t("nav_shop")}</p>
            <Link href="/shop" className="text-[16px] text-text-secondary hover:text-brand-brown py-1 block">{t("shop_cat_all")}</Link>
            <Link href="/shop?category=tote" className="text-[16px] text-text-secondary hover:text-brand-brown py-1 block">{t("nav_quilted_tote")}</Link>
            <Link href="/shop?category=hobo" className="text-[16px] text-text-secondary hover:text-brand-brown py-1 block">{t("nav_hobo_bag")}</Link>
          </div>
          {user ? (
            <div className="border-t border-border pt-3 mt-1">
              <Link href="/account" className="text-[16px] text-text-secondary hover:text-brand-brown py-1 block">{t("account_title")}</Link>
              <Link href="/account/orders" className="text-[16px] text-text-secondary hover:text-brand-brown py-1 block">{t("account_orders")}</Link>
            </div>
          ) : (
            <div className="border-t border-border pt-3 mt-1">
              <Link href="/login" className="text-[16px] text-brand-brown py-1 block">{t("auth_login")}</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
