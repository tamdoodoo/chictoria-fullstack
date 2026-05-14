"use client";

import AdminSidebar from "./AdminSidebar";
import { useLang } from "@/context/LanguageContext";

export default function AdminPageWrapper({ children }) {
  const { lang, toggleLang } = useLang();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto relative">
        <div className="flex justify-end mb-2">
          <button
            onClick={toggleLang}
            className="text-xs font-semibold uppercase tracking-wide px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-brand-brown hover:text-brand-brown transition-colors text-gray-500"
          >
            {lang === "vi" ? "EN" : "VI"}
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}
