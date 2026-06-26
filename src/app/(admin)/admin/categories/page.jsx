import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import CategoriesPageContent from "@/components/admin/CategoriesPageContent";
import { adminDb } from "@/lib/firebase-admin";

async function getCategories() {
  try {
    const snap = await adminDb.collection("categories").orderBy("nameEn").get();
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch {
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <AdminPageWrapper>
      <CategoriesPageContent initialCategories={categories} />
    </AdminPageWrapper>
  );
}
