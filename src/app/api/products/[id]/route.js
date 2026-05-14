import { adminDb } from "@/lib/firebase-admin";
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

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const doc = await adminDb.collection("products").doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(serialize({ id: doc.id, ...doc.data() }));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { id: _, ...data } = body;

    await adminDb.collection("products").doc(id).update(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    await adminDb.collection("products").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
