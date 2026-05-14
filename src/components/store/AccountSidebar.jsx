"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { SquaresFour, User, Package, Heart, MapPin, SignOut, ArrowRight } from "@phosphor-icons/react";

const menuItems = [
  { href: "/account", icon: SquaresFour, key: "account_dashboard", exact: true },
  { href: "/account/profile", icon: User, key: "account_profile" },
  { href: "/account/orders", icon: Package, key: "account_orders" },
  { href: "/account/wishlist", icon: Heart, key: "account_wishlist" },
  { href: "/account/addresses", icon: MapPin, key: "account_addresses" },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const { user, profile, logout } = useAuth();
  const { t } = useLang();

  const isActive = (item) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <aside className="w-full md:w-64 shrink-0">
      {/* User Info Card */}
      <div className="bg-white rounded-2xl border border-border p-5 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-brand-brown text-white flex items-center justify-center text-lg font-semibold">
            {(profile?.name || "U").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{profile?.name || user?.email || "—"}</p>
            <p className="text-xs text-text-muted truncate">{profile?.phone || user?.email || "—"}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-2xl border border-border p-2">
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 text-sm rounded-xl transition-colors ${
                  active
                    ? "bg-brand-brown/20 text-brand-brown font-semibold"
                    : "text-text-secondary hover:bg-cream-dark"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} weight="regular" />
                  {t(item.key)}
                </span>
                {active && <ArrowRight size={14} />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-1 pt-1 border-t border-border mx-2">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-sm text-danger hover:bg-danger-bg rounded-xl transition-colors w-full text-left"
          >
            <SignOut size={18} />
            {t("auth_logout")}
          </button>
        </div>
      </div>
    </aside>
  );
}
