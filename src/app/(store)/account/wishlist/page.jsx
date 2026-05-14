"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/formatPrice";
import AccountLayout from "@/components/store/AccountLayout";
import { Heart, ShoppingBag, Trash } from "@phosphor-icons/react";

export default function WishlistPage() {
  const { profile, loading: authLoading, refreshProfile } = useAuth();
  const { t, tProduct } = useLang();
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    const wishlist = profile?.wishlist || [];
    if (wishlist.length === 0) { setLoading(false); return; }

    Promise.all(
      wishlist.map((id) =>
        fetch(`/api/products/${id}`).then((r) => r.ok ? r.json() : null)
      )
    )
      .then((results) => setProducts(results.filter(Boolean)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [profile, authLoading]);

  const removeFromWishlist = async (productId) => {
    const updated = (profile?.wishlist || []).filter((id) => id !== productId);
    await fetch("/api/user/wishlist", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wishlist: updated }),
    });
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    await refreshProfile();
  };

  return (
    <AccountLayout title={t("account_title")}>
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-text-primary">{t("account_wishlist")}</h2>
        </div>

        {loading ? (
          <div className="px-6 py-16 text-center text-text-muted text-sm">Loading...</div>
        ) : products.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Heart size={40} className="mx-auto text-text-muted mb-3 opacity-30" />
            <p className="text-text-muted mb-4 text-sm">{t("account_no_wishlist")}</p>
            <Link href="/shop" className="text-sm text-brand-brown font-medium hover:underline">{t("cart_shop_now")}</Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {products.map((product) => {
              const name = tProduct(product, "name");
              return (
                <div key={product.id} className="flex items-center gap-4 px-6 py-4">
                  <Link href={`/product/${product.id}`} className="shrink-0">
                    <img src={product.images?.[0]} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${product.id}`} className="text-sm font-medium text-text-primary hover:text-brand-brown line-clamp-1">
                      {name}
                    </Link>
                    <p className="text-sm font-semibold text-brand-brown mt-1">{formatPrice(product.price)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => addItem(product)}
                      className="p-2 rounded-lg bg-brand-brown text-white hover:bg-brand-brown-light transition-colors"
                      title={t("product_add_to_cart")}
                    >
                      <ShoppingBag size={16} />
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="p-2 rounded-lg text-danger-light hover:bg-danger-bg hover:text-danger transition-colors"
                      title={t("account_delete")}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
