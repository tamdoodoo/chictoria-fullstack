"use client";

import { createContext, useContext, useState } from "react";
import { translations } from "@/data/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "vi";
    try {
      return localStorage.getItem("chictoria_lang") || "vi";
    } catch {
      return "vi";
    }
  });

  const toggleLang = () => {
    const next = lang === "vi" ? "en" : "vi";
    setLang(next);
    localStorage.setItem("chictoria_lang", next);
  };

  const t = (key) => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry.vi || key;
  };

  const tProduct = (product, field) => {
    if (!product) return "";
    const val = product[field];
    if (!val) return "";
    if (typeof val === "object" && val.vi) return val[lang] || val.vi;
    return val;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, tProduct }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
