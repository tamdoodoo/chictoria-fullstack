import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id || !data.name?.vi || !data.price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await adminDb.collection("products").doc(id).set({
      ...data,
      rating: data.rating || 5.0,
      reviews: data.reviews || 0,
      sold: data.sold || 0,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
