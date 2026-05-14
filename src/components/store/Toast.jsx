"use client";

import { useCart } from "@/context/CartContext";
import { CheckCircle } from "@phosphor-icons/react";

export default function Toast() {
  const { toast } = useCart();

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] bg-brand-brown-dark text-white px-5 py-3 rounded-xl shadow-lg text-sm transition-all duration-400 flex items-center gap-2 border-l-4 border-brand-gold ${
        toast
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <CheckCircle size={18} weight="fill" className="text-brand-gold shrink-0" />
      {toast}
    </div>
  );
}
