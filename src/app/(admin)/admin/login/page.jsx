"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useLang } from "@/context/LanguageContext";
import { Translate } from "@phosphor-icons/react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { lang, toggleLang, t } = useLang();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) throw new Error("Login failed");

      router.push("/admin/dashboard");
    } catch (err) {
      setError(t("admin_login_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/images/Logo.jpeg" alt="Chictoria" className="h-16 rounded-lg mx-auto mb-4" />
          <h1 className="font-display text-2xl text-brand-brown">Admin Portal</h1>
          <p className="text-sm text-text-muted mt-1">{t("admin_login_title")}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-border space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-xl text-sm outline-none focus:border-brand-gold transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">{t("admin_login_password")}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-xl text-sm outline-none focus:border-brand-gold transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-danger">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-brown text-white py-3 rounded-xl text-sm font-semibold hover:bg-brand-brown-light transition-colors disabled:opacity-50"
          >
            {loading ? t("admin_login_loading") : t("admin_login_button")}
          </button>
        </form>

        <button
          onClick={toggleLang}
          className="flex items-center gap-2 mx-auto mt-4 text-sm text-text-muted hover:text-text-secondary transition-colors"
        >
          <Translate size={16} /> {lang === "vi" ? "English" : "Tiếng Việt"}
        </button>
      </div>
    </div>
  );
}
