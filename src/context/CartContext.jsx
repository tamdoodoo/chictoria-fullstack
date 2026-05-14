"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("chictoria_cart")) || [];
      setItems(saved);
    } catch {
      setItems([]);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("chictoria_cart", JSON.stringify(items));
    }
  }, [items, loaded]);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const addItem = useCallback(
    (product, qty = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.id === product.id ? { ...i, qty: i.qty + qty } : i
          );
        }
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || product.image,
            qty,
          },
        ];
      });
      const lang = typeof window !== "undefined"
        ? localStorage.getItem("chictoria_lang") || "vi"
        : "vi";
      const name = typeof product.name === "object"
        ? product.name[lang] || product.name.vi
        : product.name;
      showToast(
        lang === "en"
          ? `Added "${name}" to cart`
          : `Đã thêm "${name}" vào giỏ hàng`
      );
      setDrawerOpen(true);
    },
    [showToast]
  );

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
  }, []);

  const updateQty = useCallback((productId, qty) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.id === productId ? { ...i, qty } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalItems,
        totalPrice,
        toast,
        loaded,
        drawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
