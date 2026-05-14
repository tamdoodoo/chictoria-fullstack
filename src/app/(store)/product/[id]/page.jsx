import { getProduct, getProducts } from "@/lib/firestore";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/store/ProductDetail";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const product = await getProduct(id);
    if (!product) return { title: "Product not found" };
    return {
      title: `${product.name?.vi || product.name} — Chictoria`,
      description: product.description?.vi || product.description,
    };
  } catch {
    return { title: "Chictoria" };
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params;

  let product = null;
  let related = [];
  try {
    product = await getProduct(id);
    if (product) {
      const all = await getProducts();
      related = all.filter((p) => p.id !== id).slice(0, 3);
    }
  } catch (e) {
    console.error("Failed to fetch product:", e.message);
  }

  if (!product) notFound();

  return <ProductDetail product={product} related={related} />;
}
