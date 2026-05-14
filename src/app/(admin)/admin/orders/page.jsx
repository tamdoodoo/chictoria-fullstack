import { getOrders } from "@/lib/firestore";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import OrdersPageContent from "@/components/admin/OrdersPageContent";

export default async function OrdersPage({ searchParams }) {
  const params = await searchParams;
  const statusFilter = params?.status || "all";

  let orders = [];
  try {
    orders = await getOrders();
  } catch (e) {
    console.error("Failed to fetch orders:", e.message);
  }

  return (
    <AdminPageWrapper>
      <OrdersPageContent orders={orders} initialFilter={statusFilter} />
    </AdminPageWrapper>
  );
}
