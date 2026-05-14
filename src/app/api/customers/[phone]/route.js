import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { phone } = await params;

  try {
    const body = await request.json();
    const updateData = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.riskLevel) updateData.riskLevel = body.riskLevel;

    await adminDb.collection("customers").doc(phone).update(updateData);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
