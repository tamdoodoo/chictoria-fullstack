"use client";

import { useState } from "react";
import { useLang } from "@/context/LanguageContext";

export default function CustomerDetailClient({ customer }) {
  const [notes, setNotes] = useState(customer.notes || "");
  const [riskLevel, setRiskLevel] = useState(customer.riskLevel || "normal");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { t } = useLang();

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/customers/${customer.phone}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, riskLevel }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert(t("admin_save_failed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">{t("admin_customer_notes_title")}</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{t("admin_customer_risk")}</label>
          <select
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
            className="w-full px-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b6b6b%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center]"
          >
            <option value="normal">{t("admin_risk_normal")}</option>
            <option value="medium">{t("admin_risk_medium")}</option>
            <option value="high">{t("admin_risk_high")}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{t("admin_customer_notes")}</label>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("admin_customer_notes_placeholder")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-brand-brown text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-brown-light transition-colors disabled:opacity-50"
        >
          {saving ? t("admin_saving") : saved ? t("admin_saved") : t("admin_save")}
        </button>
      </div>
    </div>
  );
}
