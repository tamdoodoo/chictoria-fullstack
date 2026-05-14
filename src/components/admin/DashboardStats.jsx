"use client";

import { Package, CurrencyDollar, Bell, TrendUp } from "@phosphor-icons/react";
import { useLang } from "@/context/LanguageContext";
import StatsCard from "./StatsCard";

export default function DashboardStats({ todayCount, todayRevenue, pendingCount, monthlyRevenue }) {
  const { t } = useLang();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatsCard icon={Package} label={t("admin_stat_today_orders")} value={todayCount} />
      <StatsCard icon={CurrencyDollar} label={t("admin_stat_today_revenue")} value={todayRevenue} />
      <StatsCard icon={Bell} label={t("admin_stat_pending")} value={pendingCount} />
      <StatsCard icon={TrendUp} label={t("admin_stat_monthly")} value={monthlyRevenue} />
    </div>
  );
}
