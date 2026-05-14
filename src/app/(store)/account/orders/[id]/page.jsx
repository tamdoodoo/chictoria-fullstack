import { getOrder } from "@/lib/firestore";
import { notFound } from "next/navigation";
import UserOrderDetailWrapper from "@/components/store/UserOrderDetailWrapper";

export default async function UserOrderDetailPage({ params }) {
  const { id } = await params;

  let order = null;
  try {
    order = await getOrder(id);
  } catch (e) {
    console.error("Failed to fetch order:", e.message);
  }

  if (!order) notFound();

  return <UserOrderDetailWrapper order={order} />;
}
