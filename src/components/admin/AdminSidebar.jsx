"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChartBar, Package, ShoppingBag, Users, Storefront, SignOut, Tag } from "@phosphor-icons/react";
import { useLang } from "@/context/LanguageContext";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, toggleLang, t } = useLang();

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: ChartBar },
    { href: "/admin/orders", label: t("admin_orders"), icon: Package },
    { href: "/admin/products", label: t("admin_products"), icon: ShoppingBag },
    { href: "/admin/categories", label: "Categories", icon: Tag },
    { href: "/admin/customers", label: t("admin_customers"), icon: Users },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      <div className="p-5 border-b border-gray-200">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <img src="/images/Logo.png" alt="Chictoria" className="h-10 rounded-lg" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Chictoria</p>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                pathname.startsWith(item.href)
                  ? "bg-brand-brown text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-1">
          <Storefront size={16} /> {t("admin_view_store")}
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-danger hover:text-danger transition-colors w-full text-left"
        >
          <SignOut size={16} /> {t("admin_logout")}
        </button>
      </div>
    </aside>
  );
}
