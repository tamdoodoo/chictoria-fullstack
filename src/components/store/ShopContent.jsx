"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";
import ProductCard from "./ProductCard";

export default function ShopContent({ products, initialCategory }) {
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("featured");
  const { t } = useLang();
  const router = useRouter();

  const categories = [
    { id: "all", label: t("shop_cat_all") },
    { id: "tote", label: "Quilted Tote" },
    { id: "hobo", label: "Hobo Bag" },
  ];

  const filtered = useMemo(() => {
    let list =
      category === "all"
        ? [...products]
        : products.filter((p) => p.category === category);

    switch (sort) {
      case "price-low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return list;
  }, [category, sort, products]);

  const handleCategory = (cat) => {
    setCategory(cat);
    router.push(cat === "all" ? "/shop" : `/shop?category=${cat}`, {
      scroll: false,
    });
  };

  return (
    <main className="pt-20 md:pt-[72px]">
      <div className="bg-brand-brown text-white py-12 md:py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1.5px, transparent 1.5px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="max-w-6xl mx-auto px-5 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 text-xs text-white/40 mb-4">
            <Link
              href="/"
              className="hover:text-brand-gold transition-colors"
            >
              {t("nav_home")}
            </Link>
            <span>/</span>
            <span className="text-white/60">{t("nav_shop")}</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl mb-2">
            {category === "all"
              ? t("shop_all")
              : category === "tote"
              ? "Quilted Tote"
              : "Hobo Bag"}
          </h1>
          <p className="text-sm text-white/50">
            {filtered.length} {t("shop_products_count")}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-10 md:py-14">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat.id
                    ? "bg-brand-brown text-white"
                    : "bg-cream-dark text-text-secondary hover:bg-warm"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 pr-8 py-2 border border-border rounded-lg text-sm text-text-secondary bg-white outline-none focus:border-brand-gold appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b6b6b%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center]"
          >
            <option value="featured">{t("shop_sort_featured")}</option>
            <option value="newest">{t("shop_sort_newest")}</option>
            <option value="price-low">{t("shop_sort_price_low")}</option>
            <option value="price-high">{t("shop_sort_price_high")}</option>
          </select>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-text-muted">{t("shop_no_products")}</p>
          </div>
        )}
      </div>
    </main>
  );
}
