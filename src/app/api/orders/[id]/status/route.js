import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  const { id } = await params;

  try {
    const body = await request.json();
    const updateData = { updatedAt: FieldValue.serverTimestamp() };

    if (body.status) {
      updateData.status = body.status;

      // If cancelling, restore stock
      if (body.status === "cancelled") {
        const orderDoc = await adminDb.collection("orders").doc(id).get();
        if (!orderDoc.exists) {
          return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        const order = orderDoc.data();
        if (order.status === "cancelled") {
          return NextResponse.json({ error: "Order already cancelled" }, { status: 400 });
        }

        // Restore stock in transaction
        await adminDb.runTransaction(async (transaction) => {
          for (const item of order.items) {
            const productRef = adminDb.collection("products").doc(item.productId);
            transaction.update(productRef, {
              stock: FieldValue.increment(item.qty),
              sold: FieldValue.increment(-item.qty),
            });
          }
          transaction.update(adminDb.collection("orders").doc(id), updateData);
        });

        return NextResponse.json({ success: true });
      }
    }

    if (body.paymentStatus) {
      updateData.paymentStatus = body.paymentStatus;
    }

    if (body.trackingNumber !== undefined) {
      updateData.trackingNumber = body.trackingNumber;
    }
    if (body.shippingCarrier !== undefined) {
      updateData.shippingCarrier = body.shippingCarrier;
    }

    await adminDb.collection("orders").doc(id).update(updateData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Status update failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
