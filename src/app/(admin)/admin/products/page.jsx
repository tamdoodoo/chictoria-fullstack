import { getProducts } from "@/lib/firestore";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import ProductsPageContent from "@/components/admin/ProductsPageContent";

export default async function ProductsPage() {
  let products = [];
  try {
    products = await getProducts();
  } catch (e) {
    console.error("Failed to fetch products:", e.message);
  }

  return (
    <AdminPageWrapper>
      <ProductsPageContent products={products} />
    </AdminPageWrapper>
  );
}
