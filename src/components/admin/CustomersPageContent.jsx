"use client";

import Link from "next/link";
import { useLang } from "@/context/LanguageContext";

const riskColors = {
  normal: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-danger-bg text-danger",
};

export default function CustomersPageContent({ customers }) {
  const { t } = useLang();

  const riskLabels = {
    normal: t("admin_risk_normal"),
    medium: t("admin_risk_medium"),
    high: t("admin_risk_high"),
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">{t("admin_customers")}</h1>
        <p className="text-sm text-gray-500 mt-1">{customers.length} {t("admin_customers").toLowerCase()}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{t("admin_col_phone")}</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{t("admin_col_name")}</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{t("admin_col_total_orders")}</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{t("admin_col_risk")}</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{t("admin_col_notes")}</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-400">
                  {t("admin_no_customers")}
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.phone} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/customers/${c.phone}`} className="text-brand-brown hover:underline font-mono">
                      {c.phone}
                    </Link>
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-5 py-3 text-gray-500">{c.totalOrders}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${riskColors[c.riskLevel] || riskColors.normal}`}>
                      {riskLabels[c.riskLevel] || riskLabels.normal}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 max-w-xs truncate">{c.notes || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
