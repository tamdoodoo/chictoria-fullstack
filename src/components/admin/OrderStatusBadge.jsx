"use client";

import { useLang } from "@/context/LanguageContext";

const statusColors = {
  new: "bg-blue-100 text-blue-700",
  confirmed: "bg-purple-100 text-purple-700",
  packing: "bg-yellow-100 text-yellow-700",
  shipping: "bg-orange-100 text-orange-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-danger-bg text-danger",
};

const statusKeys = {
  new: "admin_status_new",
  confirmed: "admin_status_confirmed",
  packing: "admin_status_packing",
  shipping: "admin_status_shipping",
  completed: "admin_status_completed",
  cancelled: "admin_status_cancelled",
};

export default function OrderStatusBadge({ status }) {
  const { t } = useLang();

  return (
    <span
      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
        statusColors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {t(statusKeys[status]) || status}
    </span>
  );
}
