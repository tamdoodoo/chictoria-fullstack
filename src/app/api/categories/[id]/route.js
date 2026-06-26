import { adminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const { nameVi, nameEn } = await request.json();
    if (!nameVi || !nameEn) {
      return NextResponse.json({ error: "nameVi and nameEn are required" }, { status: 400 });
    }
    await adminDb.collection("categories").doc(id).update({ nameVi, nameEn });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await adminDb.collection("categories").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
