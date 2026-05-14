import { getOrder } from "@/lib/firestore";
import { notFound } from "next/navigation";
import OrderConfirmationContent from "@/components/store/OrderConfirmationContent";

export default async function OrderConfirmationPage({ params }) {
  const { orderId } = await params;

  let order = null;
  try {
    order = await getOrder(orderId);
  } catch (e) {
    console.error("Failed to fetch order:", e.message);
  }

  if (!order) notFound();

  return <OrderConfirmationContent order={order} />;
}
