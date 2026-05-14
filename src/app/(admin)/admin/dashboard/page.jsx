import { getTodayOrders, getOrders } from "@/lib/firestore";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import DashboardContent from "@/components/admin/DashboardContent";

export default async function DashboardPage() {
  let todayOrders = [];
  let allOrders = [];

  try {
    todayOrders = await getTodayOrders();
    allOrders = await getOrders();
  } catch (e) {
    console.error("Dashboard fetch error:", e.message);
  }

  return (
    <AdminPageWrapper>
      <DashboardContent todayOrders={todayOrders} allOrders={allOrders} />
    </AdminPageWrapper>
  );
}
