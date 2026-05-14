"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import AccountSidebar from "./AccountSidebar";

export default function AccountLayout({ children, title }) {
  const { user, loading } = useAuth();
  const { t } = useLang();
  const router = useRouter();

  if (loading) {
    return <main className="pt-32 text-center text-text-muted">Loading...</main>;
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <main className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-5">
        <h1 className="font-display text-3xl text-brand-brown mb-8">{title || t("account_title")}</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <AccountSidebar />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </main>
  );
}
