import { getProducts } from "@/lib/firestore";
import ShopContent from "@/components/store/ShopContent";

export const metadata = {
  title: "Cửa hàng — Chictoria",
};

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  const category = params?.category || "all";

  let products = [];
  try {
    products = await getProducts();
  } catch (e) {
    console.error("Failed to fetch products:", e.message);
  }

  return <ShopContent products={products} initialCategory={category} />;
}
