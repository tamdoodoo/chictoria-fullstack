"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/formatPrice";
import { Heart } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { user, profile, refreshProfile } = useAuth();
  const { tProduct, t } = useLang();
  const router = useRouter();

  const name = tProduct(product, "name");
  const color = tProduct(product, "color");

  const serverWishlisted = profile?.wishlist?.includes(product.id);
  const [optimisticWishlisted, setOptimisticWishlisted] = useState(serverWishlisted);

  // Sync optimistic state when server state changes
  useEffect(() => {
    setOptimisticWishlisted(serverWishlisted);
  }, [serverWishlisted]);

  const isWishlisted = optimisticWishlisted;

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }

    // Optimistic update — flip immediately
    setOptimisticWishlisted(!isWishlisted);

    const current = profile?.wishlist || [];
    const updated = isWishlisted
      ? current.filter((id) => id !== product.id)
      : [...current, product.id];

    try {
      await fetch("/api/user/wishlist", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wishlist: updated }),
      });
      await refreshProfile();
    } catch {
      // Revert on failure
      setOptimisticWishlisted(isWishlisted);
    }
  };

  return (
    <div className="group">
      <Link
        href={`/product/${product.id}`}
        className="block relative aspect-[4/5] rounded-2xl overflow-hidden bg-cream-dark mb-3"
      >
        <img
          src={product.images[0]}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-[11px] font-semibold px-3 py-1 rounded-full ${
              product.badge === "Sale"
                ? "bg-danger text-white"
                : product.badge === "New"
                ? "bg-brand-brown text-white"
                : "bg-brand-gold text-brand-brown"
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Wishlist Heart */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white active:scale-125 transition-all duration-200 z-10"
        >
          <Heart
            size={16}
            weight={isWishlisted ? "fill" : "regular"}
            className={`transition-colors duration-200 ${isWishlisted ? "text-danger" : "text-text-muted"}`}
          />
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
          }}
          className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur text-text-primary text-sm font-medium py-2.5 rounded-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-white"
        >
          {t("card_add_to_cart")}
        </button>
      </Link>

      <Link href={`/product/${product.id}`}>
        <p className="text-[11px] uppercase tracking-widest text-text-muted mb-1">
          {color}
        </p>
        <h3 className="text-sm font-medium text-text-primary leading-snug mb-1.5 group-hover:text-brand-brown transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-brand-brown">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-text-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex text-brand-gold text-xs">
            {"★".repeat(Math.floor(product.rating))}
          </div>
          <span className="text-[11px] text-text-muted">
            ({product.reviews})
          </span>
          <span className="text-[11px] text-text-muted ml-1">
            · {t("product_sold")} {product.sold}
          </span>
        </div>
      </Link>
    </div>
  );
}
