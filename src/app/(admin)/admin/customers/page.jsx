import { getCustomers } from "@/lib/firestore";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import CustomersPageContent from "@/components/admin/CustomersPageContent";

export default async function CustomersPage() {
  let customers = [];
  try {
    customers = await getCustomers();
  } catch (e) {
    console.error("Failed to fetch customers:", e.message);
  }

  return (
    <AdminPageWrapper>
      <CustomersPageContent customers={customers} />
    </AdminPageWrapper>
  );
}
