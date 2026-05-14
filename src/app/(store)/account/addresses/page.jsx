"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import AccountLayout from "@/components/store/AccountLayout";
import { MapPin, Plus } from "@phosphor-icons/react";

export default function AddressesPage() {
  const { profile, refreshProfile } = useAuth();
  const { t } = useLang();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ label: "", address: "", isDefault: false });
  const [saving, setSaving] = useState(false);

  const addresses = profile?.addresses || [];

  const startNew = () => {
    setForm({ label: "", address: "", isDefault: addresses.length === 0 });
    setEditing("new");
  };

  const startEdit = (i) => {
    setForm({ ...addresses[i] });
    setEditing(i);
  };

  const handleSave = async () => {
    setSaving(true);
    let updated = [...addresses];
    if (editing === "new") {
      updated.push(form);
    } else {
      updated[editing] = form;
    }
    if (form.isDefault) {
      updated = updated.map((a, i) => ({
        ...a,
        isDefault: editing === "new" ? i === updated.length - 1 : i === editing,
      }));
    }

    await fetch("/api/user/addresses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addresses: updated }),
    });
    await refreshProfile();
    setEditing(null);
    setSaving(false);
  };

  const handleDelete = async (i) => {
    const updated = addresses.filter((_, idx) => idx !== i);
    await fetch("/api/user/addresses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addresses: updated }),
    });
    await refreshProfile();
  };

  return (
    <AccountLayout title={t("account_title")}>
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-text-primary">{t("account_addresses")}</h2>
          {editing === null && (
            <button onClick={startNew} className="flex items-center gap-1.5 text-sm text-brand-brown font-medium hover:underline">
              <Plus size={14} /> {t("account_add_address")}
            </button>
          )}
        </div>

        {editing !== null ? (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm text-text-muted mb-1">{t("account_address_label")}</label>
              <input
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder={t("account_address_placeholder")}
                className="w-full px-4 py-2.5 border border-border rounded-xl text-sm outline-none focus:border-brand-gold"
              />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">{t("checkout_address")}</label>
              <textarea
                rows={3}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-2.5 border border-border rounded-xl text-sm outline-none focus:border-brand-gold resize-none"
              />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="accent-brand-brown" />
              <span className="text-sm text-text-secondary">{t("account_set_default")}</span>
            </label>
            <div className="flex gap-2 pt-2">
              <button onClick={handleSave} disabled={saving} className="bg-brand-brown text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-brand-brown-light disabled:opacity-50">
                {saving ? t("account_saving") : t("account_save")}
              </button>
              <button onClick={() => setEditing(null)} className="px-5 py-2 rounded-xl text-sm text-text-muted hover:bg-cream-dark">
                Cancel
              </button>
            </div>
          </div>
        ) : addresses.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <MapPin size={40} className="mx-auto text-text-muted mb-3 opacity-30" />
            <p className="text-text-muted text-sm">{t("account_no_addresses")}</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {addresses.map((addr, i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">{addr.label || `Address ${i + 1}`}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-semibold bg-brand-gold/20 text-brand-brown px-2 py-0.5 rounded-full">{t("account_default")}</span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => startEdit(i)} className="text-xs text-brand-brown hover:underline">{t("account_edit")}</button>
                    <button onClick={() => handleDelete(i)} className="text-xs text-danger hover:underline">{t("account_delete")}</button>
                  </div>
                </div>
                <p className="text-sm text-text-secondary">{addr.address}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
