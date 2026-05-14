import { getOrder } from "@/lib/firestore";
import { notFound } from "next/navigation";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import OrderDetailClient from "@/components/admin/OrderDetailClient";

export default async function OrderDetailPage({ params }) {
  const { id } = await params;

  let order = null;
  try {
    order = await getOrder(id);
  } catch (e) {
    console.error("Failed to fetch order:", e.message);
  }

  if (!order) notFound();

  return (
    <AdminPageWrapper>
      <OrderDetailClient order={order} />
    </AdminPageWrapper>
  );
}
