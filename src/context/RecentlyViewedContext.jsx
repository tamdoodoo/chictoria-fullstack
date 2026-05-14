"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const RecentlyViewedContext = createContext();
const MAX_ITEMS = 10;
const STORAGE_KEY = "chictoria_recently_viewed";

export function RecentlyViewedProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      setItems(saved);
    } catch {
      setItems([]);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loaded]);

  const addViewed = useCallback((product) => {
    if (!product?.id) return;
    setItems((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || product.image,
          viewedAt: new Date().toISOString(),
        },
        ...filtered,
      ].slice(0, MAX_ITEMS);
    });
  }, []);

  return (
    <RecentlyViewedContext.Provider value={{ items, addViewed, loaded }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export const useRecentlyViewed = () => useContext(RecentlyViewedContext);
