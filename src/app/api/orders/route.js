import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

function serialize(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;
  if (obj.toDate && typeof obj.toDate === "function") return obj.toDate().toISOString();
  if (Array.isArray(obj)) return obj.map(serialize);
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = serialize(value);
  }
  return result;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ error: "Phone required" }, { status: 400 });
    }

    const snap = await adminDb
      .collection("orders")
      .where("phone", "==", phone)
      .orderBy("createdAt", "desc")
      .get();

    const orders = snap.docs.map((doc) => serialize({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { customerName, phone, address, items, totalPrice, shippingFee, paymentMethod, note, userId } = body;

    // Validate required fields
    if (!customerName || !phone || !address || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Run atomic transaction: create order + decrement stock
    const orderId = await adminDb.runTransaction(async (transaction) => {
      // 1. ALL READS FIRST
      const productRefs = items.map((item) => adminDb.collection("products").doc(item.productId));
      const productDocs = await Promise.all(productRefs.map((ref) => transaction.get(ref)));
      const customerRef = adminDb.collection("customers").doc(phone);
      const customerDoc = await transaction.get(customerRef);

      // 2. Validate stock
      for (let i = 0; i < items.length; i++) {
        const doc = productDocs[i];
        if (!doc.exists) {
          throw new Error(`Product ${items[i].productId} not found`);
        }
        const stock = doc.data().stock;
        if (stock < items[i].qty) {
          throw new Error(`Insufficient stock for ${items[i].name}: only ${stock} left`);
        }
      }

      // 3. ALL WRITES AFTER
      // Decrement stock
      for (let i = 0; i < items.length; i++) {
        transaction.update(productRefs[i], {
          stock: FieldValue.increment(-items[i].qty),
          sold: FieldValue.increment(items[i].qty),
        });
      }

      // Create order
      const orderRef = adminDb.collection("orders").doc();
      transaction.set(orderRef, {
        customerName,
        phone,
        address,
        items,
        totalPrice,
        shippingFee,
        status: "new",
        paymentMethod: paymentMethod || "cod",
        paymentStatus: paymentMethod === "cod" ? "cod_pending" : "pending",
        note: note || "",
        userId: userId || null,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      // Upsert customer
      if (customerDoc.exists) {
        transaction.update(customerRef, {
          name: customerName,
          totalOrders: FieldValue.increment(1),
          updatedAt: FieldValue.serverTimestamp(),
        });
      } else {
        transaction.set(customerRef, {
          name: customerName,
          notes: "",
          totalOrders: 1,
          riskLevel: "normal",
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }

      return orderRef.id;
    });

    return NextResponse.json({ orderId });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 400 }
    );
  }
}
