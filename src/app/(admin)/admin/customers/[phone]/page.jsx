import { getCustomer, getCustomerOrders } from "@/lib/firestore";
import { notFound } from "next/navigation";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import CustomerDetailPage from "@/components/admin/CustomerDetailPage";

export default async function CustomerPage({ params }) {
  const { phone } = await params;

  let customer = null;
  let orders = [];
  try {
    customer = await getCustomer(phone);
    orders = await getCustomerOrders(phone);
  } catch (e) {
    console.error("Failed to fetch customer:", e.message);
  }

  if (!customer) notFound();

  return (
    <AdminPageWrapper>
      <CustomerDetailPage customer={customer} orders={orders} />
    </AdminPageWrapper>
  );
}
