import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("__user_session")?.value;
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = await adminAuth.verifySessionCookie(session, true);
    const uid = decoded.uid;

    const doc = await adminDb.collection("users").doc(uid).get();
    if (!doc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = doc.data();
    return NextResponse.json({
      user: {
        uid,
        name: data.name,
        email: data.email,
        phone: data.phone,
        addresses: data.addresses || [],
        wishlist: data.wishlist || [],
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }
}

export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("__user_session")?.value;
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = await adminAuth.verifySessionCookie(session, true);
    const uid = decoded.uid;
    const body = await request.json();

    const updateData = { updatedAt: new Date() };
    if (body.name !== undefined) updateData.name = body.name;
    if (body.phone !== undefined) updateData.phone = body.phone;

    await adminDb.collection("users").doc(uid).update(updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
