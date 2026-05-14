"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/formatPrice";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { t, lang } = useLang();
  const { user, profile } = useAuth();
  const router = useRouter();
  const shipping = totalPrice >= 500000 ? 0 : 30000;
  const total = totalPrice + shipping;

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    paymentMethod: "cod",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [addressPicked, setAddressPicked] = useState(false);

  // Auto-fill from user profile
  useEffect(() => {
    if (profile && !addressPicked) {
      setForm((prev) => ({
        ...prev,
        customerName: prev.customerName || profile.name || "",
        phone: prev.phone || profile.phone || "",
        address: prev.address || (profile.addresses?.find((a) => a.isDefault)?.address || profile.addresses?.[0]?.address || ""),
      }));
    }
  }, [profile, addressPicked]);

  const getName = (item) => {
    if (typeof item.name === "object") return item.name[lang] || item.name.vi;
    return item.name;
  };

  const validate = () => {
    const errors = {};
    if (!form.customerName.trim()) errors.customerName = t("checkout_required");
    if (!form.phone.trim()) errors.phone = t("checkout_required");
    else if (!/^0[0-9]{9}$/.test(form.phone.trim())) errors.phone = t("checkout_phone_invalid");
    if (!form.address.trim()) errors.address = t("checkout_required");
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          userId: user?.uid || null,
          items: items.map((item) => ({
            productId: item.id,
            name: typeof item.name === "object" ? item.name.vi : item.name,
            price: item.price,
            qty: item.qty,
            image: item.image,
          })),
          totalPrice: total,
          shippingFee: shipping,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("checkout_error_generic"));
        return;
      }

      clearCart();
      router.push(`/order-confirmation/${data.orderId}`);
    } catch {
      setError(t("checkout_error_generic"));
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="pt-32 pb-20 text-center">
        <p className="text-text-muted">{t("cart_empty_title")}</p>
        <Link href="/shop" className="text-brand-brown underline mt-4 inline-block">{t("cart_shop_now")}</Link>
      </main>
    );
  }

  return (
    <main className="pt-20 md:pt-[72px]">
      <div className="bg-brand-brown text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "22px 22px" }} />
        <div className="max-w-6xl mx-auto px-5 text-center relative z-10">
          <h1 className="font-display text-3xl">{t("checkout_title")}</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-10 md:py-14">
        <form onSubmit={handleSubmit} noValidate className="grid md:grid-cols-[1fr_380px] gap-10 items-start">
          {/* Form */}
          <div className="space-y-6">
            <h2 className="font-display text-lg text-brand-brown">{t("checkout_info")}</h2>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">{t("checkout_name")} *</label>
              <input
                type="text"
                value={form.customerName}
                onChange={(e) => { setForm({ ...form, customerName: e.target.value }); setFieldErrors({ ...fieldErrors, customerName: "" }); }}
                className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-colors ${fieldErrors.customerName ? "border-danger focus:border-danger" : "border-border focus:border-brand-gold"}`}
              />
              {fieldErrors.customerName && <p className="text-xs text-danger mt-1.5">{fieldErrors.customerName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">{t("checkout_phone")} *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => { setForm({ ...form, phone: e.target.value }); setFieldErrors({ ...fieldErrors, phone: "" }); }}
                placeholder="0912345678"
                className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-colors ${fieldErrors.phone ? "border-danger focus:border-danger" : "border-border focus:border-brand-gold"}`}
              />
              {fieldErrors.phone && <p className="text-xs text-danger mt-1.5">{fieldErrors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">{t("checkout_address")} *</label>
              {profile?.addresses?.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-2">
                  {profile.addresses.map((addr, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setForm({ ...form, address: addr.address }); setAddressPicked(true); setFieldErrors({ ...fieldErrors, address: "" }); }}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        form.address === addr.address ? "border-brand-brown bg-brand-brown/5 text-brand-brown" : "border-border text-text-muted hover:border-brand-brown/30"
                      }`}
                    >
                      {addr.label || `Address ${i + 1}`}
                    </button>
                  ))}
                </div>
              )}
              <textarea
                rows={3}
                value={form.address}
                onChange={(e) => { setForm({ ...form, address: e.target.value }); setAddressPicked(true); setFieldErrors({ ...fieldErrors, address: "" }); }}
                className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-colors resize-none ${fieldErrors.address ? "border-danger focus:border-danger" : "border-border focus:border-brand-gold"}`}
              />
              {fieldErrors.address && <p className="text-xs text-danger mt-1.5">{fieldErrors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">{t("checkout_note")}</label>
              <textarea
                rows={2}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-xl text-sm outline-none focus:border-brand-gold transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">{t("checkout_payment")}</label>
              <div className="space-y-2">
                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${form.paymentMethod === "cod" ? "border-brand-brown bg-brand-brown/5" : "border-border"}`}>
                  <input type="radio" name="payment" value="cod" checked={form.paymentMethod === "cod"} onChange={() => setForm({ ...form, paymentMethod: "cod" })} className="accent-brand-brown" />
                  <span className="text-sm">{t("checkout_cod")}</span>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${form.paymentMethod === "bank_transfer" ? "border-brand-brown bg-brand-brown/5" : "border-border"}`}>
                  <input type="radio" name="payment" value="bank_transfer" checked={form.paymentMethod === "bank_transfer"} onChange={() => setForm({ ...form, paymentMethod: "bank_transfer" })} className="accent-brand-brown" />
                  <span className="text-sm">{t("checkout_bank")}</span>
                </label>
              </div>
            </div>

            {error && (
              <div className="bg-danger-bg text-danger text-sm p-4 rounded-xl">{error}</div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 border border-border sticky top-24">
            <h2 className="font-display text-lg text-brand-brown mb-5 pb-4 border-b border-border">{t("cart_summary")}</h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary line-clamp-1">{getName(item)}</p>
                    <p className="text-xs text-text-muted">x{item.qty}</p>
                  </div>
                  <p className="text-sm font-medium text-text-primary">{formatPrice(item.price * item.qty)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm border-t border-border pt-4">
              <div className="flex justify-between text-text-secondary">
                <span>{t("cart_subtotal")}</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>{t("cart_shipping")}</span>
                <span>{shipping === 0 ? t("cart_shipping_free") : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between font-semibold text-brand-brown text-base pt-3 border-t border-border">
                <span>{t("cart_total")}</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-brown text-white py-3.5 rounded-xl text-sm font-semibold mt-6 hover:bg-brand-brown-light transition-colors disabled:opacity-50"
            >
              {loading ? t("checkout_placing") : t("checkout_place_order")}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
