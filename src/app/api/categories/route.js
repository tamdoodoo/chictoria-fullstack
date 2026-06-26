import { adminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const snap = await adminDb.collection("categories").orderBy("nameEn").get();
    const categories = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { id, nameVi, nameEn } = await request.json();

    if (!id || !nameVi || !nameEn) {
      return NextResponse.json({ error: "id, nameVi and nameEn are required" }, { status: 400 });
    }

    const slug = id.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const existing = await adminDb.collection("categories").doc(slug).get();
    if (existing.exists) {
      return NextResponse.json({ error: "Category ID already exists" }, { status: 409 });
    }

    await adminDb.collection("categories").doc(slug).set({ nameVi, nameEn });
    return NextResponse.json({ id: slug });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
