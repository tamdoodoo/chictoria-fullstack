import { getProduct } from "@/lib/firestore";
import { notFound } from "next/navigation";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import ProductFormPage from "@/components/admin/ProductFormPage";

export default async function EditProductPage({ params }) {
  const { id } = await params;

  let product = null;
  try {
    product = await getProduct(id);
  } catch (e) {
    console.error("Failed to fetch product:", e.message);
  }

  if (!product) notFound();

  return (
    <AdminPageWrapper>
      <ProductFormPage product={product} />
    </AdminPageWrapper>
  );
}
