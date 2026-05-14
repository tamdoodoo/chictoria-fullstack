"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useLang } from "@/context/LanguageContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useLang();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();

      const res = await fetch("/api/auth/user-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) throw new Error("Login failed");

      router.push("/account");
      router.refresh();
    } catch {
      setError(t("auth_error_invalid"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-24 pb-20">
      <div className="max-w-sm mx-auto px-5">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-brand-brown mb-2">{t("auth_login")}</h1>
          <p className="text-sm text-text-muted">{t("auth_login_desc")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">{t("auth_email")}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-xl text-sm outline-none focus:border-brand-gold transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">{t("auth_password")}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-xl text-sm outline-none focus:border-brand-gold transition-colors"
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-brown text-white py-3 rounded-xl text-sm font-semibold hover:bg-brand-brown-light transition-colors disabled:opacity-50"
          >
            {loading ? t("auth_logging_in") : t("auth_login")}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          {t("auth_no_account")}{" "}
          <Link href="/register" className="text-brand-brown font-medium hover:underline">
            {t("auth_register")}
          </Link>
        </p>
      </div>
    </main>
  );
}
