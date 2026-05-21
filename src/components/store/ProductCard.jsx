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
  const desc = tProduct(product, "description");

  const serverWishlisted = profile?.wishlist?.includes(product.id);
  const [optimisticWishlisted, setOptimisticWishlisted] = useState(serverWishlisted);

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
      setOptimisticWishlisted(isWishlisted);
    }
  };

  const category = product.category === "tote" ? "Quilted Tote" : "Hobo Bag";

  return (
    <Link href={`/product/${product.id}`} className="group block">
      {/* Image container */}
      <div className="relative rounded-[32px] overflow-hidden bg-cream-dark aspect-[4/5] mb-4">
        <img
          src={product.images[0]}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 text-[14px] px-4 py-1 rounded-full bg-forest text-white">
            {product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-cream/80 backdrop-blur flex items-center justify-center hover:bg-cream active:scale-125 transition-all duration-200 z-10"
        >
          <Heart
            size={16}
            weight={isWishlisted ? "fill" : "regular"}
            className={`transition-colors duration-200 ${isWishlisted ? "text-danger" : "text-text-muted"}`}
          />
        </button>

        {/* Add to cart on hover */}
        <button
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
          }}
          className="absolute bottom-3 left-3 right-3 bg-lavender text-brand-brown text-[16px] font-medium py-3 rounded-[12px] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:brightness-95"
        >
          {t("card_add_to_cart")}
        </button>
      </div>

      {/* Text hierarchy: name+price → color → desc → rating */}
      <div className="px-1">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="font-display text-[18px] md:text-[20px] font-normal text-text-primary leading-[1.2] group-hover:text-text-secondary transition-colors">
            {name}
          </h3>
          <span className="text-[16px] text-text-primary shrink-0 mt-0.5">{formatPrice(product.price)}</span>
        </div>
        <p className="text-[14px] text-text-muted leading-[1.4]">{color}</p>
        {desc && (
          <p className="text-[14px] text-text-secondary mt-3 leading-[1.4] line-clamp-1">{desc}</p>
        )}
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="text-[14px] text-text-primary">{product.rating}</span>
          <div className="flex text-forest text-[12px]">
            {"★".repeat(Math.floor(product.rating))}
          </div>
          <span className="text-[14px] text-text-secondary underline">({product.reviews})</span>
        </div>
      </div>
    </Link>
  );
}
