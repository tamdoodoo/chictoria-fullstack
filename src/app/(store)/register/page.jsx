"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useLang } from "@/context/LanguageContext";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useLang();

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError(t("auth_error_password_match"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const idToken = await cred.user.getIdToken();

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          name: form.name,
          phone: form.phone,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }

      router.push("/account");
      router.refresh();
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError(t("auth_error_email_used"));
      } else {
        setError(err.message || t("auth_error_generic"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-24 pb-20">
      <div className="max-w-sm mx-auto px-5">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-brand-brown mb-2">{t("auth_register")}</h1>
          <p className="text-sm text-text-muted">{t("auth_register_desc")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">{t("auth_name")} *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={set("name")}
              className="w-full px-4 py-3 border border-border rounded-xl text-sm outline-none focus:border-brand-gold transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">{t("auth_email")} *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={set("email")}
              className="w-full px-4 py-3 border border-border rounded-xl text-sm outline-none focus:border-brand-gold transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">{t("auth_phone")} *</label>
            <input
              type="tel"
              required
              pattern="0[0-9]{9}"
              placeholder="0912345678"
              value={form.phone}
              onChange={set("phone")}
              className="w-full px-4 py-3 border border-border rounded-xl text-sm outline-none focus:border-brand-gold transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">{t("auth_password")} *</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={set("password")}
              className="w-full px-4 py-3 border border-border rounded-xl text-sm outline-none focus:border-brand-gold transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">{t("auth_confirm_password")} *</label>
            <input
              type="password"
              required
              value={form.confirm}
              onChange={set("confirm")}
              className="w-full px-4 py-3 border border-border rounded-xl text-sm outline-none focus:border-brand-gold transition-colors"
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-brown text-white py-3 rounded-xl text-sm font-semibold hover:bg-brand-brown-light transition-colors disabled:opacity-50"
          >
            {loading ? t("auth_registering") : t("auth_register")}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          {t("auth_has_account")}{" "}
          <Link href="/login" className="text-brand-brown font-medium hover:underline">
            {t("auth_login")}
          </Link>
        </p>
      </div>
    </main>
  );
}
