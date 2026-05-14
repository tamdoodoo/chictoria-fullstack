"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import AccountLayout from "@/components/store/AccountLayout";
import { PencilSimple } from "@phosphor-icons/react";

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useLang();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const isEditing = form !== null;

  const startEdit = () => {
    setForm({ name: profile?.name || "", phone: profile?.phone || "" });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/auth/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      await refreshProfile();
      setSaved(true);
      setTimeout(() => { setSaved(false); setForm(null); }, 1500);
    } catch {} finally {
      setSaving(false);
    }
  };

  return (
    <AccountLayout title={t("account_title")}>
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-text-primary">{t("account_profile")}</h2>
          {!isEditing && (
            <button onClick={startEdit} className="flex items-center gap-1.5 text-sm text-brand-brown hover:underline">
              <PencilSimple size={14} /> {t("account_edit")}
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm text-text-muted mb-1">{t("auth_name")}</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-border rounded-xl text-sm outline-none focus:border-brand-gold"
              />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">{t("auth_phone")}</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-border rounded-xl text-sm outline-none focus:border-brand-gold"
              />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">{t("auth_email")}</label>
              <input
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-2.5 border border-border rounded-xl text-sm bg-cream-dark text-text-muted"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-brand-brown text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-brand-brown-light transition-colors disabled:opacity-50"
              >
                {saving ? t("account_saving") : saved ? t("account_saved") : t("account_save")}
              </button>
              <button onClick={() => setForm(null)} className="px-5 py-2 rounded-xl text-sm text-text-muted hover:bg-cream-dark transition-colors">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            <div className="flex items-center gap-4 px-6 py-5">
              <div className="w-16 h-16 rounded-full bg-brand-brown text-white flex items-center justify-center text-2xl font-semibold shrink-0">
                {(profile?.name || user?.email || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-base font-semibold text-text-primary">{profile?.name || "—"}</p>
                <p className="text-sm text-text-muted">{user?.email}</p>
              </div>
            </div>
            <div className="flex justify-between px-6 py-4">
              <span className="text-sm text-text-muted">{t("auth_name")}</span>
              <span className="text-sm text-text-primary font-medium">{profile?.name || "—"}</span>
            </div>
            <div className="flex justify-between px-6 py-4">
              <span className="text-sm text-text-muted">{t("auth_email")}</span>
              <span className="text-sm text-text-primary">{user?.email}</span>
            </div>
            <div className="flex justify-between px-6 py-4">
              <span className="text-sm text-text-muted">{t("auth_phone")}</span>
              <span className="text-sm text-text-primary font-mono">{profile?.phone || "—"}</span>
            </div>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
