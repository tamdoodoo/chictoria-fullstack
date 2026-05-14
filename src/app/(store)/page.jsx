import { getFeaturedProducts } from "@/lib/firestore";
import HomeContent from "@/components/store/HomeContent";

export default async function HomePage() {
  let products = [];
  try {
    products = await getFeaturedProducts();
  } catch (e) {
    // Firebase not configured yet — show empty state
    console.error("Failed to fetch products:", e.message);
  }

  return <HomeContent products={products} />;
}
