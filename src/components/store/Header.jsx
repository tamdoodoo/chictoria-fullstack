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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { totalItems, openDrawer } = useCart();
  const pathname = usePathname();
  const { lang, toggleLang, t } = useLang();
  const { user, profile, loading, logout } = useAuth();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => setUserMenuOpen(false), [pathname]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navLinks = [
    { href: "/", label: t("nav_home") },
    { href: "/shop", label: t("nav_shop") },
    { href: "/shop?category=tote", label: t("nav_quilted_tote") },
    { href: "/shop?category=hobo", label: t("nav_hobo_bag") },
    { href: "/about", label: t("nav_about") },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/95 backdrop-blur-md shadow-sm"
          : "bg-cream/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-16 md:h-[72px]">
        <Link href="/" className="flex items-center shrink-0">
          <img src="/images/Logo.jpeg" alt="Chictoria" className="h-12 md:h-14 rounded-lg" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[13px] font-medium tracking-wide uppercase transition-colors hover:text-brand-brown ${
                pathname === link.href ? "text-brand-brown" : "text-text-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="text-xs font-semibold uppercase tracking-wide px-2.5 py-1.5 rounded-lg border border-border hover:border-brand-brown hover:text-brand-brown transition-colors text-text-secondary"
          >
            {lang === "vi" ? "EN" : "VI"}
          </button>

          {/* User Icon */}
          {!loading && (
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="p-2 hover:text-brand-brown transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-brown text-white flex items-center justify-center text-xs font-semibold">
                      {(profile?.name || user.email || "U").charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-border py-2 z-50">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium text-text-primary truncate">{profile?.name || user.email}</p>
                        <p className="text-xs text-text-muted truncate">{user.email}</p>
                      </div>
                      <Link href="/account" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-cream-dark transition-colors">
                        <User size={16} /> {t("account_profile")}
                      </Link>
                      <Link href="/account/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-cream-dark transition-colors">
                        <Package size={16} /> {t("account_orders")}
                      </Link>
                      <Link href="/account/wishlist" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-cream-dark transition-colors">
                        <Heart size={16} /> {t("account_wishlist")}
                      </Link>
                      <Link href="/account/addresses" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-cream-dark transition-colors">
                        <MapPin size={16} /> {t("account_addresses")}
                      </Link>
                      <div className="border-t border-border mt-1 pt-1">
                        <button
                          onClick={logout}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-danger hover:bg-danger-bg transition-colors w-full text-left"
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
              <span className="absolute -top-0.5 -right-0.5 bg-brand-brown text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
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

      <div className={`md:hidden overflow-hidden transition-all duration-300 bg-cream border-t border-border ${menuOpen ? "max-h-96" : "max-h-0"}`}>
        <nav className="px-5 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-text-secondary hover:text-brand-brown py-1">
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <div className="border-t border-border pt-3 mt-1">
                <Link href="/account" className="text-sm font-medium text-text-secondary hover:text-brand-brown py-1 block">{t("account_title")}</Link>
                <Link href="/account/orders" className="text-sm font-medium text-text-secondary hover:text-brand-brown py-1 block">{t("account_orders")}</Link>
              </div>
            </>
          ) : (
            <div className="border-t border-border pt-3 mt-1">
              <Link href="/login" className="text-sm font-medium text-brand-brown py-1 block">{t("auth_login")}</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
